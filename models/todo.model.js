import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide todo title'],
    },

    isComplete: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        required: [true, "Enter date of the task"]
    },
    delayed: {
        type: Boolean,
        default: false
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
