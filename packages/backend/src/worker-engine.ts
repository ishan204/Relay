
import { testFailureHandler, testHandler } from "./handlers.ts";
import { claimNextJob, markCompleted, markFailed, markRunning } from "./jobs.ts";
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function startWorker(namespace: string, id: number){
    while(true){
        const job = await claimNextJob(namespace);
        if(!job){
            await sleep(1000)
            continue
        }
        try{
            console.log(`Worker ${id} started`)
            await testHandler(job.payload)
            await markCompleted(job.id)
            console.log(
    `[WORKER] Completed job ${job.id}`
);
        }catch(err){
             const message =
        err instanceof Error
            ? err.message
            : "Unknown error";
            await markFailed(job.id, message)
            console.log("Processing failed. Message - ", message)
        }
    }
}