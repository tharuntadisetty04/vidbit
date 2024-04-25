import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

app.use(express.json({ limit: "16kb" }))

app.use(express.urlencoded({ limit: "16kb", extended: true }))

app.use(express.static("public"))

app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.on("error", (err) => {
    console.log("App error : ", err);
    throw err;
})

export default app