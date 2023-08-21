import { Router } from "express";
import { completeTodo, createTodo, getTodos } from '../controllers/todo.controller.js'


const todoRouter = Router()

todoRouter.route('/').post(createTodo).get(getTodos)
todoRouter.route('/:id').patch(completeTodo)

export default todoRouter

