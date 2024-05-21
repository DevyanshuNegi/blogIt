import { Router } from "express"
import app from "../../app.js"
import { getRandomTen } from "../controllers/blog.controller.js";
import axios from "axios";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";


const router = Router()

var errormsg = null;

var blogIdList = [];

router.route("/home").get(
    async (req, res) => {
        try {
            const [randomBlogsResponse,
                // recentBlogsResponse,
                popularBlogResponse,
                isLoggedIn
            ] = await Promise.all([
                axios.get("http://localhost:" + (process.env.PORT || 8000) + "/api/v1/blogs/randomBlogs"),
                // axios.get("http://localhost:" + (process.env.PORT || 8000) + "/api/v1/blogs/recent"),
                axios.get("http://localhost:" + (process.env.PORT || 8000) + "/api/v1/blogs/getPopular"),
                axios.get("http://localhost:" + (process.env.PORT || 8000) + "/api/v1/users/checkUserLoggedIn")
            ]);

            // console.log(popularBlog.data.data)
            console.log(isLoggedIn.data.data)
            const user = isLoggedIn.data.data;

            const randomBlogs = randomBlogsResponse.data.data;
            // const recentBlogs = recentBlogsResponse.data.data;
            const popularBlog = popularBlogResponse.data.data;

            blogIdList = randomBlogs.map(blog => { // adding id of blogs to list
                return blog._id
            })
            for (let index = 0; index < randomBlogs.length; index++) {
                const element = randomBlogs[index];
                const created = randomBlogs[index].createdAt.split('T');
                randomBlogs[index].createdAt = created[0];
            }

            res.render("pages/home.ejs", {
                randomBlogs,
                //  recentBlogs, 
                popularBlog,
                user
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Error fetching blogs from backend' }); // Handle errors gracefully
        }
    })




router.route('/blog').get(async (req, res) => {

    const blogId = req.query.id;
    console.log("BLOG ID", blogId);

    try {
        // const blog = await findBlogById(blogId); // Replace with your logic to find blog by ID
        const blogDetails = await axios.get("http://localhost:" + (process.env.PORT || 8000) + `/api/v1/blogs/getBlogDetails?id=${blogId}`);

        const mostRecentComments = await axios.get("http://localhost:" + (process.env.PORT || 8000) + `/api/v1/blogs/getBlogComments?id=${blogId}`)


        const comments = mostRecentComments.data.data;
        for (let index = 0; index < comments.length; index++) {
            const element = comments[index];
            const created = comments[index].createdAt.split('T');
            comments[index].createdAt = created[0];
        }

        const blog = blogDetails.data.data
        blog.createdAt = blog.createdAt.split('T')[0]
        res.render('pages/blogDetails.ejs', { blog, comments });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error fetching blog details');
    }
});



router.route('/auth').get(async (req, res) => {
    res.render("pages/auth.ejs", { errormsg })
})

router.route('/login').post(async (req, res) => {
    console.log(req.body)
    // const formData = new FormData();
    // formData.append("email", req.body.email);
    // formData.append("password", req.body.password);
    // console.log(formData)
    var statuscode = 0;
    try {
        const login = await axios.post("http://localhost:" + (process.env.PORT || 8000) + "/api/v1/users/login", req.body)
        console.log("response ", login.data)
        statuscode = login.status;
        errormsg = login.data.message;
        res.send(login)
    } catch (error) {
        console.log("error", error.message)
    }

    if (statuscode == 200) {
        errormsg = null;
        res.redirect("/home")
    }
    else {
        res.redirect("/auth")
    }
});

router.route('/signin').post(async (req, res) => {
    console.log(req.body)
    // const formData = new FormData();
    // formData.append("email", req.body.email);
    // formData.append("password", req.body.password);
    // formData.append("username", req.body.username);
    // formData.append("fullName", req.body.fullName);
    try {
        const register = await axios.post("http://localhost:" + (process.env.PORT || 8000) + "/api/v1/users/register", req.body)
        console.log("response ", register)

    } catch (error) {
        console.log("error", error.message)
    }

    res.send("Signin")
})

export default router;