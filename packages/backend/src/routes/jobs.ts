import express, { Router } from 'express'
import {addNewJob, getAllJobs, getJobResult} from '../jobs.ts'
const JobRouter:Router = express.Router()
JobRouter.get("/", getAllJobs)
JobRouter.get("/:id", getJobResult)
JobRouter.post("/", addNewJob)
export default JobRouter;