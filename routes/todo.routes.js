import { Router } from "express";
import { completeTodo, createTodo, deleteTodo, getTodos } from '../controllers/todo.controller.js'


const todoRouter = Router()

todoRouter.route('/').post(createTodo).get(getTodos)
todoRouter.route('/:id').patch(completeTodo).delete(deleteTodo)

export default todoRouter

