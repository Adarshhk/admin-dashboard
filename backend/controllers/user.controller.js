import { User } from "../models/user.model.js";

const getAll = async (req , res) => {
    try {
        const {_id} = req.user;

        const user = await User.findById(_id).select("loginHistory activeDevices username email");

        return res.status(200).json(user);

    } catch (error) {
        console.log(error)
        return res.status(500).json({"error" : "something went wrong in getAll controller."})
    }
}

export {getAll}