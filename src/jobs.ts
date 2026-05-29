import {client} from './db.js'

export async function enqueueJob(type: string, payload: any, namespace:string) {
    const status = 'PENDING'
    const qry  = 'INSERT INTO JOBS(type, status, payload, namespace) VALUES ($1, $2, $3, $4) RETURNING *'
    const res = await client.query(qry, [type, status, payload, namespace])    
    return res.rows[0]
}

export async function getNextJob(namespace: string) {
    const qry = `SELECT * FROM jobs WHERE status='PENDING' and namespace=($1) and next_run_at <= NOW() order by priority desc, created_at asc limit 1 FOR UPDATE SKIP LOCKED;`
    const res = await client.query(qry, [namespace])
    return res.rows
}

export async function markCompleted(id: number){
    const qry = `UPDATE jobs SET completed_at=NOW(),status='COMPLETED' where id=($1) RETURNING *;`
    const res = await client.query(qry, [id])
    return res.rows[0]
}

export async function markRunning(id: number) {
    const qry = `UPDATE jobs SET status='RUNNING' where id=($1) RETURNING *;`
    const res= await client.query(qry, [id])
    return res.rows[0]
}
