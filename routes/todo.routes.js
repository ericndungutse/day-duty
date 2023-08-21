import { Router } from "express";
import { createTodo, getTodos } from '../controllers/todo.controller.js'

const todoRouter = Router()

todoRouter.route('/').post(createTodo).get(getTodos)

export default todoRouter

