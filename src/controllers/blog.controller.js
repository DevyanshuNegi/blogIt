import { User } from "../models/user.model.js"
import { Blog } from "../models/blog.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import bcrypt from "bcrypt"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const createBlog = asyncHandler(async (req, res) => {
    /**
     * check if user logged in // done
     * get user details
     * get the details from user: 
     *      title, content, category, description, thumbnail
     * check if empty and give error
     * create new blog and save
     * get the blog from db to confirm and give error
     */

    const user = req.user;

    const { title, content, category, description, isPublished } = req.body;

    console.log(title, content, category, description, isPublished);

    const localFilePath = req.file.path

    const isEmpty = [title, content, localFilePath].some(field => !field || field.trim() === "");
    if (isEmpty) {
        throw new ApiError(404, "title content and thumbnail is required");
    }

    const thumbnail = await uploadOnCloudinary(localFilePath)

    const blog = await Blog.create(
        {
            title: title,
            content: content,
            author: user._id,
            category: category,
            description: description,
            thumbnail: thumbnail.url,
            isPublished: isPublished
        }
    )

    console.log(blog)

    return res
        .status(200)
        .json(
            new ApiResponse(201, blog, "Blog created successfully!!!")
        )

})

const getRandomTen = asyncHandler(async (req, res) => {

})

export { createBlog, getRandomTen }
// git commit -m"created blog routes and createBlog controller"