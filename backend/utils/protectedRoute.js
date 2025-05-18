import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const proctedRoute = async (req, res, next) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // console.log(currentUser);

        req.user = currentUser;
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Unauthorized" });   
    }
};
