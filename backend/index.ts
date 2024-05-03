import express from 'express';
import { Server } from 'socket.io';
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const io = new Server(3000)
app.get("/" , (req , res) => {
    res.send("helow");
})

io.on('connect' , () => {
    console.log('connected')
})

app.listen(3000 , () => {
    console.log('listening on port 3000')
})