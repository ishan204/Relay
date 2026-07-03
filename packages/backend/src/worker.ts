import { startWorker } from "./worker-engine.ts"
import {client} from './db.ts'
async function main(){
    await client.connect()
    await startWorker("testSpace")
    await client.end()
}
main()