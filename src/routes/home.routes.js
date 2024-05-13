import { Router } from "express"
import app from "../../app.js"
import { getRandomTen } from "../controllers/blog.controller.js";
import axios from "axios";


const router = Router()

router.route("/").get(
    (req, res) => {
        axios.get("http://localhost:" + (process.env.PORT || 8000) + "/api/v1/blogs/randomBlogs")
            .then((response) => {
                // console.log(response.data);
                const blogs = response.data.data;

                res.render("pages/home.ejs", {blogs});

            }).catch((error) => {
                // console.log(error);
                console.log(error.message);
                res.send("error occored")
            })
    }
)

export default router;