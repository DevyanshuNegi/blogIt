import mongoose from "mongoose";
import { Schema } from "mongoose";

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
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

// Indexes for better search and sorting and finding by user and blog
CommentSchema.index({ author: 1 }); 
CommentSchema.index({ blog: 1 });   


export const Comment = mongoose.model("Comment", CommentSchema)