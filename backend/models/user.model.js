import mongoose from "mongoose";
import { hash } from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6 
    },
    twoFactor : {
        type :Boolean,
        required : true,
        default :false,
    },
    activeDevices: [{
        deviceName: {
            type: String,
            
        },
        accessToken: {
            type: String,
            
        }
    }],
    loginHistory: [{
        deviceName: {
            type: String,
            
        },
        action: {
            type: String,
            enum: ['login', 'logout'],
            
        },
        time: {
            type: Date,
            
        }
    }]
} , {timestamps : true});

userSchema.pre('save', async function (next) {
    
    if (this.isModified('password')) {
        this.password = await hash(this.password, 8);
    }
    next();
});


export const User = mongoose.model('User', userSchema);

