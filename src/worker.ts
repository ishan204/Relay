import { startWorker } from "./worker-engine.ts"
import {client} from './db.ts'
async function main(){
    await client.connect()
    await startWorker("email")
    await client.end()
}
main()