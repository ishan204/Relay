import express, { Router } from 'express'
import {getAllJobs} from '../jobs.ts'
const JobRouter:Router = express.Router()
JobRouter.get("/", getAllJobs)

export default JobRouter;