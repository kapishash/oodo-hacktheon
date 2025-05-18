import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
    const {name, email, password} = req.body;
    
    try {
        if (!name || !email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({message: "Please enter a valid email"});
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({message: "Please enter a strong password"});
    }

    const existingUser = await User.findOne({email});

    if (existingUser) {
        return res.status(400).json({message: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const user = await User.create(
        {
            name, 
            email, 
            password: hashedPassword
        }
    );

    user.save();

    res.status(201).json({message: "User created successfully"});

    } catch (error) {
        console.log("error in signup:",error.message);
        res.status(500).json({message: "Something went wrong"});
        
    }
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        }).status(200).json({message: "Login successful"});
    } catch (error) {
        console.log("error in login:",error.message);
        res.status(500).json({message: "Something went wrong"});
    }
})

router.post("/logout", (req, res) => {
    try {
        res.clearCookie("token").status(200).json({message: "Logout successful"});
    } catch (error) {
        console.log("error in logout:",error.message);
        res.status(500).json({message: "Something went wrong"});
    }

})

export default router;