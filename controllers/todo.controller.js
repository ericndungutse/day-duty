import Todo from "../models/todo.model.js";

const createTodo = async (req, res, next) => {
    try {
        const todoBody = { ...req.body, user: req.user.id }
        const todo = await Todo.create(todoBody)

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
        const todos = await Todo.find({ user: req.user.id })

        res.status(200).json({
            status: 'success',
            count: todos.length,
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

const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, {
            new: true
        })

        if (!todo) {
            return res.status(404).json({
                status: 'fail',
                message: "Todo not found"
            })
        }

        if (Date.parse(todo.date) < Date.now()) {
            todo.delayed = true
            await todo.save()
        }

        res.status(200).json({
            status: 'success',
            data: {
                todo: {
                    title: todo.title,
                    date: todo.date,
                    description: todo.description,
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

const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id })

        if (!todo) {
            return res.status(404).json({
                status: 'fail',
                message: "Todo not found"
            })
        }

        res.status(204).json({
            status: 'success',
        })

    } catch (err) {
        console.log('Error💥 ', err)
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        })
    }
}


export { createTodo, getTodos, deleteTodo, updateTodo }