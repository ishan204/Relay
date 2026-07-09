import express, { Router } from 'express'
import {getAllJobs, getJobResult} from '../jobs.ts'
const JobRouter:Router = express.Router()
JobRouter.get("/", getAllJobs)
JobRouter.get("/:id", getJobResult)
export default JobRouter;