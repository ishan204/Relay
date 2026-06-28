import { Client } from "pg";

export const client = new Client({
  host: "localhost",
  port: 5433,
  user: "postgres",
  password: "postgres",
  database: "relay",
});

export async function connectDb(){
  await client.connect()
  console.log("Successfully Connected to Postgres")
}