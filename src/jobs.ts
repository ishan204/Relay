import {client} from './db.ts'
import { JobStatus } from '../types.ts'
export async function enqueueJob(type: string, payload: unknown, namespace:string) {
    const status = JobStatus.PENDING
    const qry  = 'INSERT INTO JOBS(type, status, payload, namespace) VALUES ($1, $2, $3, $4) RETURNING *'
    const res = await client.query(qry, [type, status, payload, namespace])
    console.log("Job added to queue.")
    return res.rows[0]
}

export async function getNextJob(namespace: string) {
    const status = JobStatus.PENDING
    const qry = `SELECT * FROM jobs WHERE status=($1) and namespace=($2) and next_run_at <= NOW() order by priority desc, created_at asc limit 1 FOR UPDATE SKIP LOCKED;`
    const res = await client.query(qry, [status,namespace])
    return res.rows[0] ?? null
}

export async function markCompleted(id: number){
    const status = JobStatus.COMPLETED
    const qry = `UPDATE jobs SET completed_at=NOW(),status=($1) where id=($2) RETURNING *;`
    const res = await client.query(qry, [status,id])
    return res.rows[0]
}

export async function markRunning(id: number) {
    const status = JobStatus.RUNNING
    const qry = `UPDATE jobs SET status=($1), started_at=NOW() where id=($2) RETURNING *;`
    const res= await client.query(qry, [status,id])
    return res.rows[0]
}

export async function markFailed(id:number, error:string){
    const status = JobStatus.FAILED
    const qry = `UPDATE jobs SET status=($1), attempts=attempts+1, next_run_at=NOW()+INTERVAL '30 seconds', error=($2) where id=($3) RETURNING *`
    const res = await client.query(qry, [status, error, id])
    return res.rows[0]
}