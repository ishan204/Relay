import {client} from './db.js'
import { enqueueJob, getNextJob, markCompleted, markFailed, markRunning } from './jobs.js'


const createTable = `
Create table jobs(
    id Bigserial PRIMARY KEY,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    priority INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    payload JSONB NOT NULL,
    next_run_at TIMESTAMPZ DEFAULT NOW(),
    error TEXT, 
    created_at TIMESTAMPZ DEFAULT NOW(),
);
`

async function main() {
    const payload = {
        message: 'send this email to the user', 
        userMail: 'ij@gmail.com'
    }
    await client.connect()
    await client.query('BEGIN;')
    const res = await getNextJob('EMAIL')
    const runn = await markRunning(res.id)
    const comp = await markCompleted(runn.id)
    console.log(comp)
    await client.query('COMMIT;')
    await client.end()
}

main()