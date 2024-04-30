import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const blogSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,

    },
    thumbnail: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    title: {
        type: String,
        requierd: true,
        trim: true,
    },
    description: {
        type: String,
        // requierd: true,
        trim: true,
    },
    views: {
        type: Number,
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false,
    },


}, { timestamps: true })

blogSchema.plugin(mongooseAggregatePaginate)

export const Blog = mongoose.Schema("Blog", videoSchema)
