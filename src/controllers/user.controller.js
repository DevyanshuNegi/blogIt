import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import bcrypt from "bcrypt"
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = (async (userId) => {

    try {
        const user = await User.findById(userId)

        console.log(user);

        const accessToken = user.generateAccessToken()
        console.log("access token : ", accessToken);
        const refreshToken = user.generateRefreshToken()


        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        console.log(" access and refresh token ", accessToken, refreshToken);

        return { accessToken, refreshToken }
    } catch (error) {
        console.log("this is error")
        console.log(error)
        throw new ApiError(500, "went wrong while gen access and ref token");
    }
})


const registerUser = asyncHandler(async (req, res) => {

    /*
    register user :
    take info
    check if anything missing and give error
    check if already exist and giver error 
    push to db and give error
    fetch by user id 
    give response 
    */

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

    if (dbUser !== null) {
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

    if (checkingUser === null) {
        throw new ApiError(403, "error on upload")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(201, checkingUser, "User registered")
        )
})


const loginUser = asyncHandler(async (req, res) => {
    /*
    get info
    check if nothing empty give error
    find in the db
    compare password give errror
    generate access and refresh token
    update refresh token in db
    pass refresh and access token in cookies
    */
    const { username, email, password } = req.body;
    console.log(username, email, password);

    if(!username && !email) {
        throw new ApiError(404, "username or email is required");
    }

    if (!password) {
        throw new ApiError(401, "password is required");
    }

    // checking already existing

    const user = await User.findOne({
        $or: [
            { username },
            { email },
        ],
    });

    if (user === null) {
        throw new ApiError(404, "User not found")
    }

    const isCorrect = user.isPasswordCorrect(password)

    if (!isCorrect) {
        throw new ApiError(402, "Password in not correct")
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(user)

    const loggedInUser = await User.findById(user._id). // you can update also without 
        select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }


    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    /**
     get the cookies and then 
     make a middleware to get the info of user
     remove the refresh token from the user
     */
})

const refreshAccessToken = asyncHandler(async (req, res) => {

})


export { loginUser, registerUser, logoutUser, refreshAccessToken }