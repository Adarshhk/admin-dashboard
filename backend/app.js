import express from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

import userRouter from "./routes/auth.route.js"

app.use("/user" , userRouter);
export {app}