import handleServerErrors from "../utils/handleServerErrors.js";
import User from '../models/User.js';

export const getProfile = async (req, res) => {
    try {
        const {_id} = req.user;

        const user = (await User.findOne({_id}))._doc;

        delete user._id;
        delete user.passwordHash;
        delete user.createdAt;
        delete user.updatedAt;

        res.json({user});
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};