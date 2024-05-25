import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));

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

app.set('view engine', 'ejs');



import userRouter from "./src/routes/user.routes.js"
import blogRouter from "./src/routes/blog.routes.js"

app.use("/users", userRouter)

app.use("/", blogRouter)



export default app;
export {app};



