import express from "express";
import Product from "../models/productsModel.js";
import { proctedRoute } from "../utils/protectedRoute.js";

const router = express.Router();


router.get("/", proctedRoute, async (req, res) => {
  try {
    const { category, search, limit = 10, page = 1 } = req.query;

    let filter = {};
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // Use 'name' as per your model
    }

    // Convert limit and page to numbers, provide defaults
    const lim = Math.max(Number(limit), 1);
    const skip = (Math.max(Number(page), 1) - 1) * lim;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 }) // newest first, optional
      .skip(skip)
      .limit(lim);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/user", proctedRoute, async (req, res) => {
    try {
        const products = await Product.find({ ceratedBy: req.user.id });
        res.status(200).json(products);
        
    } catch (error) {
        console.log("error in product api:", error.message)
        res.status(500).json({ message: error.message });
        
    }
})

router.get("/:id", proctedRoute, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/add_product", proctedRoute, async (req, res) => {

    const { name, image, price, category, description } = req.body;

    try {
        if (!name || !price || !category || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const product = new Product(
            { 
                name, 
                price, 
                category, 
                description,
                ceratedBy: req.user.id,
            }
        );
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Unable to add product." });
        console.log("error in create route", error.message);
    }
});

router.delete("/:id", proctedRoute, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (product.ceratedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        await product.deleteOne();
        res.json({ message: "Product deleted", product });
        
    } catch (error) {
        res.status(500).json({message: "Unable to delete product" });
        console.log("error in delete route", error.message);
        
    }
});

router.put("/:id", proctedRoute, async (req, res) => {
    // const { name, image, price, category, description } = req.body;
    try {
        // if (!name || !price || !category || !description) {
        //     return res.status(400).json({ message: "No field to update" });
        // }
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (product.ceratedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "error updating product." });
        console.log("error in update product route", error.message);
    }
});


export default router;
