/**
 * take user._id, content, blog._id
 * 
 * 
 */

import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const addComment = asyncHandler(async (req, res)=> {

    
    const userId = req.user._id;
    const query = req.query;
    const blogId = query?.id;
    const content = query?.content;

    console.log(userId, blogId, content)

    // check if any empty
    const isEmpty = [userId, blogId, content].some(field => !field || field.toString().trim() === "");
    if (isEmpty) {
        throw new ApiError(404, "all fields are required");
    }

    const comment = await Comment.create({
        author: userId,
        content: content,
        blog: blogId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(201, comment, "Created comment")
        )
})

export {addComment};