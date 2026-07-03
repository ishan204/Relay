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
        message: 'Send preliminary Report', 
        userMail: 'ij@gmail.com',
        jobnum: 0
    }
    await client.connect()
    await enqueueJob("test", payload, 'testSpace', 3)
    await enqueueJob("test", payload, 'testSpace', 2)
    await enqueueJob("test", payload, 'testSpace', 1)
    await client.end()
}

main()