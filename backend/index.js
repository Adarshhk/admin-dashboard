import { app } from './app.js';
import { Server } from 'socket.io';
import * as dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export const io = new Server(5000)

io.on('connection' , () =>{
    console.log('connected')
})
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO}`)
        console.log(`\n MongoDB connected !! `);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

connectDB().then(() => {
    app.listen(process.env.PORT , () => {
        console.log('listening on port 3000')
    })
});


