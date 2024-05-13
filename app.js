import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded // for decoding url
    ({ extended: true }, { limit: "16kb" }) // optional
)
app.use(express.static("public")) // for images and ...

app.use(cookieParser()) // for storing and reading safe cookies


// Use EJS as the view engine
app.set('view engine', 'ejs');

// Other middleware and route handlers...

import userRouter from "./src/routes/user.routes.js"
import homeRouter from "./src/routes/home.routes.js"
import blogRouter from "./src/routes/blog.routes.js"

app.use("/api/v1/users", userRouter)

app.use("/api/v1/blogs", blogRouter)


// front end routes
app.use("/home", homeRouter)


export default app;
export {app};



