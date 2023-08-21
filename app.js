import express from "express"
import todoRouter from "./routes/todo.routes.js"


const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({
        status: "success",
        data: "Welcome to DSchedule"
    })
})

app.use('/api/v1/todos', todoRouter)

app.use('*', (req, res) => {
    console.log(req.baseUrl)
    res.status(400).json({
        status: 'fail',
        message: `Cannot find ${req.baseUrl} on this server.`
    })
})

export default app

