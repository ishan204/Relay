import { testFailureHandler, testHandler } from "./handlers.ts";
import { getNextJob, markCompleted, markFailed, markRunning } from "./jobs.ts";
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function startWorker(namespace: string){
    while(true){
        const job = await getNextJob(namespace);
        if(!job){
            await sleep(1000)
            continue
        }
        try{
            await markRunning(job.id)
            console.log(
    `[WORKER] Processing job ${job.id}`
);
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