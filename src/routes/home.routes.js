import { Router } from "express"
import app from "../../app.js"
import { getRandomTen } from "../controllers/blog.controller.js";
import axios from "axios";


const router = Router()

var blogIdList = [];

router.route("/home").get(
    async (req, res) => {
        try {
            const [randomBlogsResponse,
                // recentBlogsResponse,
                popularBlogResponse

            ] = await Promise.all([
                axios.get("http://localhost:" + (process.env.PORT || 8000) + "/api/v1/blogs/randomBlogs"),
                // axios.get("http://localhost:" + (process.env.PORT || 8000) + "/api/v1/blogs/recent"),
                axios.get("http://localhost:" + (process.env.PORT || 8000) + "/api/v1/blogs/getPopular"),
            ]);

            // console.log(popularBlog.data.data)

            const randomBlogs = randomBlogsResponse.data.data;
            // const recentBlogs = recentBlogsResponse.data.data;
            const popularBlog = popularBlogResponse.data.data;

            blogIdList = randomBlogs.map(blog => { // adding id of blogs to list
                return blog._id
            })

            res.render("pages/home.ejs", {
                randomBlogs,
                //  recentBlogs, 
                popularBlog
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

        res.render('pages/blogDetails.ejs', { blogDetails });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error fetching blog details');
    }
});


// for (let heading = 0; heading < headingList.length; heading++) {
//     app.get(("/" + headingList[heading]).replaceAll(" ", "%20"), (req, res) => {
//         var currBlog = { heading: headingList[heading], blogText: blogTextList[heading] }
//         res.render("readelement.ejs", currBlog);
//         console.log(heading);
//     })
// }

export default router;