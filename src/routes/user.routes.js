import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken, 
    isLogedIn, authPage  , loginUserPage, registerUserPage, logoutUserPage} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkUserAuth } from "../middlewares/user.middleware.js";

const router = Router()

router.route("/api/register").post(
    registerUser
)

router.route("/api/login").post(loginUser)
router.route("/checkUserLoggedIn").get(checkUserAuth, isLogedIn)


router.route("/auth").get(authPage)
router.route("/login").post(loginUserPage)
router.route("/register").post(registerUserPage)
// router.route("/register").post(registerUser) 


// secured routes
router.route("/logout").post(verifyJWT, logoutUserPage)
// router.route("/logout").post(verifyJWT,// this mw will run first and you can add more middlewares , , then fun
//     // then the next function inside will run next fun.
//     logoutUser)

router.route("/refresh-token").post(refreshAccessToken)


export default router