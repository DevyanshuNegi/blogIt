import { Router } from "express";
import { createBlog, getBlogDetails, getPopular, getRandomTen } from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import multer from "multer";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/randomBlogs").get(getRandomTen);
router.route("/getPopular").get(getPopular);
router.route("/getBlogDetails").get(getBlogDetails);
// secured routes
// here firstly middleware will check if user is logged in

router.route("/create").post(verifyJWT,
    upload.single(
        'thumbnail'
    ),
    createBlog);


export default router;