import { Pool } from "pg"
export const pool = new Pool({
  host:"localhost",
  port:5433,
  user:"postgres",
  password:"postgres",
  database:"relay",
  max:Number(process.env.WORKER_COUNT)
})