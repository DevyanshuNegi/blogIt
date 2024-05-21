import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken, isLogedIn  } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkUserAuth } from "../middlewares/user.middleware.js";

const router = Router()

router.route("/register").post( // MW, mainFunction

    // upload.fields([ // accepts array
    //     {
    //         name: "avatar",
    //         maxCount: 1
    //     },
    //     {
    //         name: "coverImage",
    //         maxCount: 1
    //     }
    // ]),
    registerUser
)

router.route("/login").post(loginUser)
router.route("/checkUserLoggedIn").get(checkUserAuth, isLogedIn)

// router.route("/register").post(registerUser) 

// register method is called
// this is ther route that will be added after 
// http://localhost:8000/api/v1/users


// secured routes

router.route("/logout").post(verifyJWT,// this mw will run first and you can add more middlewares , , then fun
    // then the next function inside will run next fun.
    logoutUser)

router.route("/refresh-token").post(refreshAccessToken)


export default router