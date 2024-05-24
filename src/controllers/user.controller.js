import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import bcrypt from "bcrypt"
import { ApiResponse } from "../utils/ApiResponse.js";


var errormsg = null;


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

const isLogedIn = asyncHandler(async (req, res) => {
    /**
     *  get the user from middleware
     * return the user
     */
    console.log("isLoggedIn", req);
    const user = req.user;
    // console.log(user)
    if (user === null) {
        return res.status(200).json(new ApiResponse(200, null, "User not logged in"))
    }
    return res.status(200).json(new ApiResponse(200, user, "User logged in"))

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
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id)
    const passCorrect = user.isPasswordCorrect(oldPassword);

    if (!passCorrect) {
        throw new ApiError(400, "invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed Successfully"));

})

const loginUser = asyncHandler(async (req, res) => {
    // console.log(req)
    const { username, email, password } = req.body;
    console.log(username, email, password);

    if (!username && !email) {
        // throw new ApiError(404, "username or email is required");
        errormsg = "username or email is required"
        res.redirect("/users/auth")
    }

    if (!password) {
        // throw new ApiError(422, "password is required");
        errormsg = "password is required";
        res.redirect("/users/auth")
    }

    // checking already existing

    const user = await User.findOne({
        $or: [
            { username },
            { email },
        ],
    });

    if (user === null) {
        // throw new ApiError(404, "User not found")
        errormsg = "User not found";
    }

    const isCorrect = user.isPasswordCorrect(password)

    if (!isCorrect) {
        // throw new ApiError(402, "Password in not correct")
        errormsg = "Password is not correct"
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user)

    console.log("access and ref token ", accessToken, refreshToken) // woking fine till here

    const loggedInUser = await User.findById(user._id) // you can update also without 
        .select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .redirect("/blogs/home")
})

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullName, password, email } = req.body;
    console.log(username, fullName, password, email);

    const isEmpty = [username, email, fullName, password].some(field => !field || field.trim() === "");

    console.log(isEmpty);

    if (isEmpty) {
        // throw new ApiError(422, "All fields are required");
        errormsg = "All fields are required";
        res.redirect("/users/auth")
    }

    // checking already existing

    const dbUser = await User.findOne({
        $or: [
            { username },
            { email },
        ],
    });

    if (dbUser !== null) {
        // throw new ApiError(402, "User already existed")
        errormsg = "User already existed"
        res.redirect("/users/auth")
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
        // throw new ApiError(403, "error on upload")
        errormsg = "not registered"
        res.redirect("/users/auth")
    }

    return res
        .status(200)
        .redirect("/users/auth")
})

const authPage = asyncHandler(async (req, res) => {
    res.render("pages/auth.ejs", { errormsg })
})

const logoutUser = asyncHandler(async (req, res) => {
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
        .redirect("/blogs/home")
})

export {
    isLogedIn,
    changeCurrentPassword, authPage, loginUser, registerUser, logoutUser
}
// changing half of codebase