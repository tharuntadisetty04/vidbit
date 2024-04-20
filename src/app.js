import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.on("error", (err) => {
    console.log("App error : ", err);
    throw err;
})

app.get('/', (req, res) => {
    res.send('Hello Worladd')
})

export default app