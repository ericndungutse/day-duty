import { Router } from "express";
import { createTodo, deleteTodo, getTodos, updateTodo } from '../controllers/todo.controller.js'
import { protect } from "../controllers/auth.controller.js";


const todoRouter = Router()
todoRouter.use(protect)
todoRouter.route('/').post(createTodo).get(getTodos)
todoRouter.route('/:id').patch(updateTodo).delete(deleteTodo)

export default todoRouter

