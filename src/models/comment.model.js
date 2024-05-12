import mongoose from "mongoose";
import { Schema } from "@mui/icons-material";

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Comment = mongoose.model("Comment", CommentSchema)