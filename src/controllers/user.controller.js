import {User} from "../models/user.model.js"
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import bcrypt from "bcrypt"
import { ApiResponse } from "../utils/ApiResponse.js";


/*
register user :
take info
check if anything missing and give error
check if already exist and giver error 
push to db and give error
fetch by user id 
give response 
*/

const registerUser = asyncHandler(async (req, res) => {


    const { username, fullName, password, email } = req.body;
    console.log(username, fullName, password, email);

    const isEmpty = [username, email, fullName, password].some(field => !field || field.trim() === "");

    console.log(isEmpty);

    if (isEmpty) {
        throw new ApiError(401, "All fields are required");
    }

    // checking already existing

    const dbUser = await User.findOne({
        $or: [
            { username },
            { email },
        ],
    });

    if(dbUser !== null) {
        throw new ApiError(402, "User already existed")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        username: username.toLowerCase(),
        fullName: fullName,
        email: email,
        password: hashedPassword
    })

    const checkingUser = await User.findById(user._id, {
        password: 0, // Exclude password field
        accessToken: 0, // Exclude accessToken field
    });

    console.log(checkingUser) 

    if(checkingUser === null) {
        throw new ApiError(403, "error on upload")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201, checkingUser, "User registered")
    )
})

const loginUser = asyncHandler(async (req, res) => {

})

const logoutUser = asyncHandler(async (req, res)=> {

})

const refreshAccessToken = asyncHandler(async (req, res) => {

})


export { loginUser, registerUser, logoutUser, refreshAccessToken }