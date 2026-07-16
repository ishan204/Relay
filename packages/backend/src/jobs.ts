import { pool } from "../db/pool.ts";
import { JobStatus } from "../../shared/src/types.ts";
import type { Request, Response } from "express";
import type { Client, PoolClient } from "pg";
import publisher from "./redis/publisher.ts";
export async function enqueueJob(
  type: string,
  payload: unknown,
  namespace: string,
  priority: number,
  max_attempts?: number,
) {
  const status = JobStatus.PENDING;
  let qry;
  let res;
  if (max_attempts != undefined && max_attempts != 3) {
    qry =
      "INSERT INTO JOBS(type, status, payload, namespace, priority, max_attempts) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    res = await pool.query(qry, [
      type,
      status,
      payload,
      namespace,
      priority,
      max_attempts,
    ]);
  } else {
    qry =
      "INSERT INTO JOBS(type, status, payload, namespace, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    res = await pool.query(qry, [type, status, payload, namespace, priority]);
  }
  await publisher.publish(
    "jobs",
    JSON.stringify({ type: "JOB_ENQUEUE", job: res.rows[0] }),
  );
  console.log("Job added to queue.");
  return res.rows[0];
}

export async function addNewJob(req: Request, res: Response) {
  const { type, payload, namespace, priority } = req.body;
  const result = await enqueueJob(type, payload, namespace, priority);
  return res.json(result);
}

export async function claimNextJob(workerId: number) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const status = JobStatus.PENDING;
    const qry = `SELECT * FROM jobs WHERE status=($1) and next_run_at <= NOW() order by priority desc, created_at asc limit 1 FOR UPDATE SKIP LOCKED;`;
    const res = await client.query(qry, [status]);
    if (res.rows.length === 0) {
      await client.query("COMMIT");
      return null;
    }
    const updatedRow = await markRunning(client, res.rows[0].id, workerId);
    await client.query("COMMIT");

    return updatedRow;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.release();
  }
}

export async function markRunning(
  client: PoolClient,
  job_id: number,
  workerId: number,
) {
  const status = JobStatus.RUNNING;
  console.log(`[WORKER] Processing job ${job_id}`);
  const qry = `UPDATE jobs SET status=($1),attempts=attempts+1, started_at=NOW(), worker_id=($2) where id=($3) RETURNING *;`;
  const res = await client.query(qry, [status, workerId, job_id]);
  await publisher.publish(
    "jobs",
    JSON.stringify({
      type: "JOB_UPDATE",
      status: JobStatus.RUNNING,
      id: job_id,
    }),
  );
  return res.rows[0];
}
export async function getAllJobs(req: Request, res: Response) {
  try {
    const qry = "SELECT * FROM jobs order by created_at desc;";
    const result = await pool.query(qry);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
}

export async function markCompleted(id: number, result: any) {
  const status = JobStatus.COMPLETED;
  const qry = `UPDATE jobs SET completed_at=NOW(),status=($1) where id=($2) RETURNING *;`;
  const res = await pool.query(qry, [status, id]);
  const row = res.rows[0];
  const qyres = await addJobAttempt(
    row.id,
    row.attempts,
    row.worker_id,
    status,
    result,
    row.started_at,
  );
  await publisher.publish(
    "jobs",
    JSON.stringify({
      type: "JOB_UPDATE",
      status: JobStatus.COMPLETED,
      id: id,
    }),
  );
  return qyres;
}

export async function addJobAttempt(
  job_id: number,
  attempt: number,
  worker_id: string,
  status: JobStatus,
  result: any,
  started_at: any,
) {
  const qy = `INSERT INTO job_attempts(job_id, attempt_number,worker_id, status, error, started_at, finished_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())`;
  const qyres = await pool.query(qy, [
    job_id,
    attempt,
    worker_id,
    status,
    result,
    started_at,
  ]);
  return qyres.rows[0];
}

export async function markFailed(id: number, error: string) {
  const status = JobStatus.PENDING;
  const qy = `SELECT attempts, max_attempts from jobs where id=($1)`;
  const result = await pool.query(qy, [id]);
  const { attempts, max_attempts } = result.rows[0];
  let qry;
  let res;
  if (attempts === max_attempts) {
    qry = `UPDATE jobs SET status=($1),error=($2) where id=($3) RETURNING *`;
    res = await pool.query(qry, [JobStatus.DEAD, error, id]);
    await publisher.publish(
      "jobs",
      JSON.stringify({
        type: "JOB_UPDATE",
        status: JobStatus.DEAD,
        id: id,
      }),
    );
  } else {
    const time = Math.min(30 * Math.pow(2, attempts - 1), 600);
    qry = `UPDATE jobs SET status=($1), next_run_at=NOW()+INTERVAL '${time} seconds', error=($2) where id=($3) RETURNING *`;
    res = await pool.query(qry, [status, error, id]);
    await publisher.publish(
      "jobs",
      JSON.stringify({
        type: "JOB_UPDATE",
        status: JobStatus.FAILED,
        id: id,
      }),
    );
  }
  const row = res.rows[0];
  const qyres = await addJobAttempt(
    row.id,
    attempts,
    row.worker_id,
    JobStatus.FAILED,
    error,
    row.started_at,
  );
  return qyres;
}

export async function getJobResult(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const jobId = Number(id);
    if (!Number.isInteger(jobId)) {
      return res.status(400).json({ error: "Invalid job id" });
    }
    const qry = `SELECT * from job_attempts where job_id=($1)`;
    const result = await pool.query(qry, [jobId]);
    return res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
}
