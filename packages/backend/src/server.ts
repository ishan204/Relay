import express from 'express'
import JobRouter from './routes/jobs.ts'
import { connectDb } from './db.ts'
import cors from 'cors'
const app = express()
app.use(cors({
    origin:'http://localhost:3000'
}))
async function main(){
    await connectDb()
    console.log('Mounting JobRouter')
    app.use("/jobs", JobRouter)
    app.get('/', (req, res) => {
        res.send("Hello")
    })
    
    
    app.listen(8080, () => {
        console.log("App listening on port 8080")
    })
}

main()