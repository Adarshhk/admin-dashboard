import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';



export const verifyJWT = async (req , res , next ) => {
    try {
        const {accessToken} = req.cookies;
    
        const username  = jwt.verify(accessToken , process.env.JWT_SECRET);
        const user = await User.findOne({username}).select("-password -loginHistory -activeDevices -twoFactor");
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({"error" : "something went wrong in middleware"})
    }
}