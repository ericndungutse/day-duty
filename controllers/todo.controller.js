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

const completeTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id)

        if (!todo) {
            return res.status(404).json({
                status: 'fail',
                message: "Todo not found"
            })
        }

        todo.isComplete = true
        Date.parse(todo.date) < Date.now() ? todo.delayed = true : todo.delayed = todo.delayed

        await todo.save()

        res.status(200).json({
            status: 'success',
            data: {
                todo: {
                    title: todo.title,
                    date: todo.date,
                    isComplete: todo.isComplete,
                    delayed: todo.delayed
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

export { createTodo, getTodos, completeTodo }