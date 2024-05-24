import { Router } from "express"
import app from "../../app.js"
import { getRandomTen } from "../controllers/blog.controller.js";
import axios from "axios";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";

axios.defaults.withCredentials = true;

const router = Router()

var errormsg = null;



router.route('/auth').get(async (req, res) => {
    res.render("pages/auth.ejs", { errormsg })
})

router.route('/login').post(async (req, res) => {
    console.log(req.body)
    var statuscode = 0;

    var loginResponse = undefined;

    try {
        loginResponse = await axios.post("http://localhost:" + (process.env.PORT || 8000) + "/users/login", req.body)

        statuscode = loginResponse.status;
        errormsg = loginResponse.data.message;

        const accessToken = loginResponse.data.data.accessToken;
        const refreshToken = loginResponse.data.data.refreshToken;
        const options = {
            httpOnly: true,
            secure: true
        }
        res.cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)


        if (statuscode == 200) {
            errormsg = null;
            res.redirect("/home")
        }
        else {
            res.redirect("/auth")
        }
    } catch (error) {
        console.log("error", error.message)
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
        const register = await axios.post("http://localhost:" + (process.env.PORT || 8000) + "/users/register", req.body)
        console.log("response ", register)

    } catch (error) {
        console.log("error", error.message)
    }

    res.send("Signin")
})

export default router;