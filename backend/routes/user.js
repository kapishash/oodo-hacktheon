import express from "express";
import User from "../models/userModel.js";
import { proctedRoute } from "../utils/protectedRoute.js";

const router = express.Router();


router.get("/profile", proctedRoute, async (req, res) => {
    try {
        const users = await User.findById(req.user._id).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.log("error occured in get profile route", error.message);
        res.status(500).json({ message: error.message });
    }
})

router.put("/profile", proctedRoute, async (req, res) => {
    const {name} = req.body;

    try {
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name;
        await user.save();
        res.status(200).json(user);
        
    } catch (error) {
         console.log("error occured in put profile route", error.message);
        res.status(500).json({ message: error.message });
        
    }
})

// Cart
// router.get('/cart', proctedRoute, async (req, res) => {
//   const user = await User.findById(req.user.id).populate('cart');
//   res.json(user.cart);
// });

// router.post('/cart', proctedRoute, async (req, res) => {
//   const { productId } = req.body;
//   const user = await User.findById(req.user.id);
//   if (!user.cart.includes(productId)) user.cart.push(productId);
//   await user.save();
//   res.json(user.cart);
// });

// router.delete('/cart/:productId', proctedRoute, async (req, res) => {
//   const { productId } = req.params;
//   const user = await User.findById(req.user.id);
//   user.cart = user.cart.filter(id => id.toString() !== productId);
//   await user.save();
//   res.json(user.cart);
// });

// // Purchases
// router.get('/purchases', proctedRoute, async (req, res) => {
//   const user = await User.findById(req.user.id).populate('purchases');
//   res.json(user.purchases);
// });






export default router;