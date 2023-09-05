import express from "express"
import cors from 'cors'

import todoRouter from "./routes/todo.routes.js"
import authRouter from "./routes/auth.routes.js"
import globalErrHandler from "./controllers/err.controller.js"
import AppError from "./utils/AppError.js"

const app = express()
app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({
        status: "success",
        data: "Welcome to DSchedule"
    })
})

app.use('/api/v1/todos', todoRouter)
app.use('/api/v1/auth', authRouter)

app.use("*", (req, res, next) => {
    return next(
        new AppError(`Cannot find "${req.originalUrl}" on this server`, 404)
    );
});

app.use(globalErrHandler);

export default app

