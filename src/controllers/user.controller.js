import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import bcrypt from "bcrypt"
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = (async (userId) => {

    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()


        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })


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

    if (!username && !email) {
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

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user)

    console.log("access and ref token ", accessToken, refreshToken) // woking fine till here

    const loggedInUser = await User.findById(user._id) // you can update also without 
        .select("-password -refreshToken")

    const options = {
        httpOnly: true,
        // secure: true
    }

    console.log(loggedInUser)

    return res
        .status(200)
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

    // remove cookies and also 
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true // you will get new upadted value in return
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    console.log("** User logged out **")

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    /**
     * take refersh token from cookies or body or give error
     * decode the token
     * take the user from db and gen new token or give error
     * generate new tokens retrun the response with success
     */
    try {

        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshAccessToken;
        if (!incomingRefreshToken) {
            throw new ApiError(401, "unauthorized request");
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: ture
        }
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newRefreshToken)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    /**
     * get the oldPassword and newPassword
     * check if not empty and give errror
     * check user in db and give error
     * change password and save
     * return response
     */

    // console.log(req)
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user?._id)
    const passCorrect = user.isPasswordCorrect(oldPassword);

    if(!passCorrect) {
        throw new ApiError(400, "invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed Successfully"));

})

export { loginUser, registerUser, logoutUser, refreshAccessToken,
     changeCurrentPassword }