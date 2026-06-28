import {client} from './db.ts'
import { enqueueJob, getAllJobs, getNextJob, markCompleted, markFailed, markRunning } from './jobs.ts'


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
    await client.end()
}

main()