import { Redis } from "ioredis";
const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
export default publisher;
