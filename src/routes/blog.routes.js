import { Router } from "express";
import { createBlog, getRandomTen } from "../controllers/blog.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import multer from "multer";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/randomBlogs").get(getRandomTen);

// secured routes
// here firstly middleware will check if user is logged in

router.route("/create").post(
    verifyJWT,

    upload.single( // accepts array
        'thumbnail'
        // {
        //     name: "thumbnail",
        //     maxCount: 1
        // },
    ),
    createBlog);


export default router;