import { startWorker } from "./worker-engine.ts"
async function main(){
    const workerCount = Number(process.env.WORKER_COUNT ?? 3)

    for(let i = 1; i <= workerCount; i++){
        startWorker("testSpace", i+1)
    }
}
main()