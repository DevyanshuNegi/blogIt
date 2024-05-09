import {Schema} from "mongoose"
import mongoose from "mongoose"

const HistorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    action: {
        type: String,
        enum: ['viewed', 'liked', 'commented'], // Add more actions as needed
        required: true
    },
    // timestamp: {
    //     type: Date,
    //     default: Date.now
    // }
}, {timestamps: true});

export const History = mongoose.model("History", HistorySchema); 