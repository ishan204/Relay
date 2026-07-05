import { enqueueJob } from './jobs.ts'

async function main() {
    const payload = {
        message: 'Send preliminary Report', 
        userMail: 'ij@gmail.com',
        jobnum: 0
    }
    
    await enqueueJob("test", payload, 'testSpace', 3)
    await enqueueJob("test", payload, 'testSpace', 3)
    await enqueueJob("test", payload, 'testSpace', 2)
    await enqueueJob("test", payload, 'testSpace', 3)
    await enqueueJob("test", payload, 'testSpace', 3)
    await enqueueJob("test", payload, 'testSpace', 3)
    await enqueueJob("test", payload, 'testSpace', 1)
    await enqueueJob("test", payload, 'testSpace', 1)
    await enqueueJob("test", payload, 'testSpace', 1)
}

main()