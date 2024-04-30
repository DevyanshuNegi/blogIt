import "dotenv/config"

import app from "./app.js"
import connectDB from "./src/db/index.db.js";

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, ()=> {
        console.log(`Running on port ${process.env.PORT||8000}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

