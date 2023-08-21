import Todo from "../models/todo.model.js";

const createTodo = async (req, res, next) => {
    try {
        const todo = await Todo.create(req.body)

        res.status(201).json({
            status: 'success',
            data: {
                todo: {
                    id: todo.id,
                    title: todo.title,
                    date: todo.date
                }
            }
        })

    } catch (err) {
        console.log('Error💥 ', err)
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        })
    }
}

const getTodos = async (req, res, next) => {
    try {
        const todos = await Todo.find(req.body)

        res.status(200).json({
            status: 'success',
            data: {
                todos
            }
        })

    } catch (err) {
        console.log('Error💥 ', err)
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        })
    }
}



export { createTodo, getTodos }