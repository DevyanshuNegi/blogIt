import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        requierd: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,

    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
        // requierd: true,
        trim: true,
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false,
    },
    // tags: {
    //     type: [String]
    // },
    // comments: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Comment'
    // }],
    category: {
        type: [String],
        enum: [
            "Lifestyle", "Technology", "Business", 
            "Entertainment", "Science ", "Parenting", 
            "Social Issues", "Personal Development", "Finance",
        ],
        default: []
    }
    

}, { timestamps: true })

blogSchema.plugin(mongooseAggregatePaginate)

export const Blog = mongoose.model("Blog", blogSchema)
