import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide todo title'],
    },

    status: {
        type: String,
        enum: ['pending', 'completed', 'delayed'],
        default: 'pending'
    },

    date: {
        type: Date,
        required: [true, "Enter date of the task"]
    },

    description: {
        type: String
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.'],
    },
}, {

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})

todoSchema.pre(/^find/, function (next) {
    this.select("-__v -createdAt -updatedAt")
    this.sort('date')
    next()
})

const Todo = mongoose.model('Todo', todoSchema)

export default Todo
