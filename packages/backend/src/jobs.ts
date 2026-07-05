import { pool } from '../db/pool.ts'
import { JobStatus } from '../../shared/src/types.ts'
import type { Request, Response } from 'express'
import type { Client, PoolClient } from 'pg'
export async function enqueueJob(type: string, payload: unknown, namespace:string, priority: number, max_attempts?: number ) {
    const status = JobStatus.PENDING
    const qry  = 'INSERT INTO JOBS(type, status, payload, namespace, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *'
    const res = await pool.query(qry, [type, status, payload, namespace, priority])
    console.log("Job added to queue.")
    return res.rows[0]
}

export async function claimNextJob(namespace: string) {
    const client = await pool.connect()
    try{
        await client.query("BEGIN");
        const status = JobStatus.PENDING
        const qry = `SELECT * FROM jobs WHERE status=($1) and namespace=($2) and next_run_at <= NOW() order by priority desc, created_at asc limit 1 FOR UPDATE SKIP LOCKED;`
        const res = await client.query(qry, [status,namespace])
        if (res.rows.length === 0) {
        await client.query("COMMIT");
        return null;
    }
        const updatedRow = await markRunning(client,res.rows[0].id)
        await client.query("COMMIT");
        return updatedRow
    }catch(err){
        await client.query("ROLLBACK")
        throw err;
    }finally{
        await client.release()
    }
}

export async function markRunning(client: PoolClient,id: number) {
    const status = JobStatus.RUNNING
     console.log(
    `[WORKER] Processing job ${id}`
);
    const qry = `UPDATE jobs SET status=($1), started_at=NOW() where id=($2) RETURNING *;`
    const res= await client.query(qry, [status,id])
    return res.rows[0]
}
export async function getAllJobs(req: Request, res:Response){
    try{
        const qry = 'SELECT * FROM jobs order by created_at desc;'
        const result = await pool.query(qry)
        return res.json(result.rows)
    }catch(err){
         console.error(err);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
}

export async function markCompleted(id: number){
    const status = JobStatus.COMPLETED
    const qry = `UPDATE jobs SET completed_at=NOW(),status=($1) where id=($2) RETURNING *;`
    const res = await pool.query(qry, [status,id])
    return res.rows[0]
}


export async function markFailed(id:number, error:string){
    const status = JobStatus.FAILED
    const qry = `UPDATE jobs SET status=($1), attempts=attempts+1, next_run_at=NOW()+INTERVAL '30 seconds', error=($2) where id=($3) RETURNING *`
    const res = await pool.query(qry, [status, error, id])
    return res.rows[0]
}