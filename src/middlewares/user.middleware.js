import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
// import { User } from "../models/user.models.js";
import { User } from "../models/user.model.js"


export const checkUserAuth = asyncHandler(async (req, res,
    next) => {
    try {

        const token = req.cookies?.accessToken || req.header
            ("Authorization")?.replace("Bearer ", "")

        if (!token) {
            // throw new ApiError(401, "Unauthorized request")
            req.user = null;
            next()
        }
        else{


        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).
            select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next()
        }

    } catch (error) {
        // console.log("error on auth middleware")
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})