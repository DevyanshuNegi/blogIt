import { Router } from "express"

const router = Router()

router.route("/").get(
    (req, res) => {
        res.render("pages/home.ejs");
    }
)

export default router;