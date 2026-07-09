import { enqueueJob, markFailed } from './jobs.ts'

async function main() {
    const payload = {
        message: 'Send preliminary Report', 
        userMail: 'ij@gmail.com',
        jobnum: 0
    }
    
    const res = await markFailed(96, "Intentional Failure")
    console.log(res)

}

main()