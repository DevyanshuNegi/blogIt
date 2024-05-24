import { Blog } from "../models/blog.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Comment } from "../models/comment.model.js";
import { History } from "../models/history.model.js";
// import { localBlogHistory } from "../constants.js"; 

// var blogIdList = [];
var localBlogHistory = [];

async function getMostRecentVisitedBlogs(userId) {
    try {
        // const blogs = await History.find({
        //     // user: mongoose.Types.ObjectId(userId),
        //     user: userId,
        //     action: 'viewed' // Filter for 'viewed' action
        // })
        //     .sort({ createdAt: -1 }) // Sort by creation date (descending)
        //     .limit(3); // Limit to 3 documents
            
        const blogs = await History.find({
            user: userId,
            action: 'viewed' // Filter for 'viewed' action
        })
            .sort({ createdAt: -1 }) // Sort by creation date (descending)
            .limit(3)
            .populate({
                path: Blog, // Field name referencing the blog
            }); // Populate with specific fields

        console.log("inside function ", blogs);
        // return blogs.map(history => history.blog); // Extract blog IDs
        return blogs;
    } catch (error) {
        console.error(error);
        return []; // Handle errors gracefully (return empty array)
    }
}

async function hasVisitedBlog(userId, blogId) {
    try {
        const history = await History.findOne({
            user: userId,
            blog: blogId,
            action: 'viewed' // Filter for 'viewed' action
        });

        return !!history; // Return true if history exists, false otherwise
    } catch (error) {
        console.error(error);
        return false; // Handle errors gracefully
    }
}

const getHomePageData = async () => {
    const randomBlogs = await Blog.aggregate([
        { $sample: { size: 10 } }
    ])

    if (!randomBlogs) {
        throw new ApiError(404, "Blogs not found ");
    }

    const popularBlog = await Blog.find({})
        .sort({ views: -1 })
        .limit(1)

    if (!popularBlog) {
        throw new ApiError(404, "Blogs not found");
    }
    // console.log(randomBlogs, popularBlog);

    return { randomBlogs, popularBlog };
}


const createBlog = asyncHandler(async (req, res) => {
    /**
     * check if user logged in // done
     * get user details
     * get the details from user: 
     *      title, content, category, description, thumbnail
     * check if empty and give error
     * create new blog and save
     * get the blog from db to confirm and give error
     */

    const user = req.user;

    const { title, content, category, description, isPublished } = req.body;

    console.log(title, content, category, description, isPublished);

    var newcategory = category; // to convier string to list
    if (typeof (category) == "string") {
        newcategory = category.split(", ");
    }

    const localFilePath = req.file.path

    const isEmpty = [title, content, localFilePath].some(field => !field || field.trim() === "");
    if (isEmpty) {
        throw new ApiError(404, "title content and thumbnail is required");
    }

    const thumbnail = await uploadOnCloudinary(localFilePath)

    /**remove this code */
    var max = 700
    var min = 70
    const views = Math.floor(Math.random() * (max - min + 1)) + min;

    const blog = await Blog.create(
        {
            title: title,
            content: content,
            author: user._id,
            category: newcategory,
            description: description,
            thumbnail: thumbnail.url,
            isPublished: isPublished,
            views: views /** remove this code */
        }
    )

    // console.log(blog)

    return res
        .status(200)
        .json(
            new ApiResponse(201, blog, "Blog created successfully!!!")
        )

})

const getRandomTen = asyncHandler(async (req, res) => {
    /**
     * get list of 10-15 blogs from the db
     */

    const blogs = await Blog.aggregate([
        { $sample: { size: 10 } }
    ])

    // console.log(blogs)

    if (!blogs) {
        throw new ApiError(404, "Blogs not found ");
    }

    res.status(200)
        .json(new ApiResponse(200, blogs, "Blog responses from db"))
})

const getPopular = asyncHandler(async (req, res) => {

    const blogs = await Blog.find({})
        .sort({ views: -1 })
        .limit(1)

    if (!blogs) {
        throw new ApiError(404, "Blogs not found");
    }

    res.status(200)
        .json(new ApiResponse(200, blogs, "Blog responses from db are here "));
})

// Function to retrieve blog details by ID
const getBlogDetails = asyncHandler(async (req, res) => {
    const blogId = req.query.id;
    console.log(blogId);
    const blog = await Blog.findById(blogId);

    blog.views = blog.views + 1;
    await blog.save({ validateBeforeSave: false })



    if (!blog) {
        throw new ApiError(404, 'Blog not found'); // Handle non-existent blog
    }

    res.status(200).json(new ApiResponse(200, blog, 'Blog detail response'));
});


const homePage = asyncHandler(async (req, res) => {
    var { randomBlogs, popularBlog } = await getHomePageData();
    // console.log(response);
    var user = req.user;

    const blogIdList = randomBlogs.map(blog => { // adding id of blogs to list
        return blog._id
    })
    for (let index = 0; index < randomBlogs.length; index++) {
        const element = randomBlogs[index];
        const created = randomBlogs[index].createdAt.toString().split('T');
        randomBlogs[index].createdAt = created[0];
    }
    var historyBlogs = [];

    if (user) {
        // await getMostRecentVisitedBlogs(user._id)
        //     .then(blogs => {
        //         // console.log('Most recent visited blogs:', blogs);
        //         historyBlogs = blogs;
        //     })
        //     .catch(error => {
        //         console.error('Error fetching blogs:', error);
        //     });
        historyBlogs = await Blog.aggregate([
            { $sample: { size: 3 } }
        ])
    } else {
        // try {
        //     historyBlogs = await History.find({
        //         _id: { $in: localBlogHistory.map(id => mongoose.Types.ObjectId(id)) }
        //     });
        // } catch (error) {
        //     // res.redirect("/blogs/home")
        //     console.log("error", error.message)
        // }
    }
    console.log("history Blogs", historyBlogs)

    res.render("pages/home.ejs", {
        randomBlogs,
        popularBlog,
        user,
        historyBlogs
    });
})

const blogDetailPage = asyncHandler(async (req, res) => {
    const user = req.user;

    const blogId = req.query.id;
    const blog = await Blog.findById(blogId);
    var visited = false;


    if (user) {
        const userId = user._id;

        hasVisitedBlog(userId, blogId)
            .then(visited => {
                console.log(`User has visited the blog: ${visited}`);
                if (visited == false) {
                    // Add blog to history
                    const history = new History({
                        user: userId,
                        blog: blogId,
                        action: 'viewed'
                    });
                    history.save()
                        .then(() => {
                            console.log('History saved successfully');
                        })
                        .catch(error => {
                            console.error('Error saving history:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error checking history:', error);
            });
    }
    else {
        // maintain a local history
        if (!(blogId in localBlogHistory)) {
            localBlogHistory.unshift(blogId);
            if (localBlogHistory.length > 3) {
                localBlogHistory.pop();
            }
            console.log(localBlogHistory)
        }
    }


    // increase views of blog
    blog.views = blog.views + 1;
    await blog.save({ validateBeforeSave: false })

    if (!blog) {
        throw new ApiError(404, 'Blog not found'); // Handle non-existent blog
    }

    // getting comments
    const comments = await Comment.find({ blog: blogId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("author", 'username')

    res.render('pages/blogDetails.ejs', { blog, comments, user });
})

const addComment = asyncHandler(async (req, res) => {
    // console.log(req)
    const user = req.user;
    const { content, blogId } = req.body;
    // const blogId = req.query.id;
    const userId = user._id;
    console.log(userId, blogId, content)
    const isEmpty = [userId, blogId, content].some(field => !field || field.toString().trim() === "");
    if (isEmpty) {
        // throw new ApiError(404, "all fields are required");
        res.redirect("/blogs/blog?id=" + blogId);
    }

    const comment = await Comment.create({
        author: userId,
        content: content,
        blog: blogId
    })

    res.redirect("/blogs/blog?id=" + blogId);
})


export { createBlog, getRandomTen, getPopular, getBlogDetails, homePage, blogDetailPage, addComment, getHomePageData }