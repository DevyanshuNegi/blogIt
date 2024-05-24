import { Router } from "express";
import {  isLogedIn, authPage  , loginUser, registerUser, logoutUser} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkUserAuth } from "../middlewares/user.middleware.js";

const router = Router()


router.route("/checkUserLoggedIn").get(checkUserAuth, isLogedIn)

router.route("/auth").get(authPage)

router.route("/login").post(loginUser)

router.route("/register").post(registerUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)


export default router