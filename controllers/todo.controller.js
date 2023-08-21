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
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
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
        const todo = await Todo.findByIdAndDelete(req.params.id)

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