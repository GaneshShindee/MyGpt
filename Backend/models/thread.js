import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});


const ThreadSchema = new mongoose.Schema({
    thread: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: [MessageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Thread = mongoose.model("Thread", ThreadSchema);
export default Thread;
