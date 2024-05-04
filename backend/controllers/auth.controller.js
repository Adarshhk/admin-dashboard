
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { compare } from "bcrypt";

const generateAccessToken = async (username) => {
    try {
        const user = await User.findOne({ username })
        const token = jwt.sign(user.username , process.env.JWT_SECRET)
        return token;
    } catch (error) {
        console.log(error);
        return "";
    }
}

const signup = async (req , res) => {
    try {
        const { username, email, password, deviceName } = req.body;

        if (!username || !email || !password || !deviceName) {
            return res.status(400).json({ error: 'One or more fields are empty.' });
        }

        if(password.length < 6)return res.status(400).json({ error: 'Password length must be 6 characters long' });

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existedUser) {
            return res.status(401).json({"error" : "User with email or username already exists"})
            
        }
        const accessToken = await generateAccessToken(username);

        if(accessToken == "") res.status(500).json({"error" : "something went wrong while generating token."})

        const user = await User.create({
            username,
            email,
            password,

        })

        if (!user) return res.status(500).json({"error" : "Something went wrong while creating user."});

        user.activeDevices.push({ deviceName, accessToken });
        user.loginHistory.push({ deviceName, action: "login", time: Date.now() })
        await user.save();
        return res.cookie('accessToken' , accessToken).status(200).json({ "success": "signed up successfully." })
    } catch (error) {
        console.log(error);
        res.status(500).json({"error" : "something went wrong while signing up."});
    }
}

const login = async (req , res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ "error": 'User not found.' });
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password.' });
        }

        const accessToken = await generateAccessToken(user.username);

        user.activeDevices.push({ deviceName: req.body.deviceName, accessToken });
        user.loginHistory.push({ deviceName: req.body.deviceName, action: 'login', time: Date.now() });

        res.cookie('accessToken' , accessToken);
        await user.save();

        return res.cookie('accessToken' , accessToken).status(200).json({ success: 'Logged in successfully.' });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Something went wrong while logging in.' });
    }
};

const logout = async (req , res) => {
    const userData = req.user;
    const {deviceName} = req.body;
    if(!userData) return res.status(404).json({"error" : "user not found"})
    if(!deviceName) return res.status(404).json({"error" : "Device not found"})
    
    const user = await User.findById(userData._id);

    user.activeDevices.filter(device => 
        device.deviceName !== deviceName
    )

    user.loginHistory.push({deviceName , action : 'logout' , time : Date.now()});
    await user.save();
    return  res.cookie('accessToken' , "").status(200).json({"success" : "User Logged out successfully."})

};

export {login , signup , logout}