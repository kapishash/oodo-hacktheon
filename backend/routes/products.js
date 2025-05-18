import express from "express";
import Product from "../models/productsModel.js";
import { proctedRoute } from "../utils/protectedRoute.js";

const router = express.Router();



router.get("/", proctedRoute, async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/create_product", proctedRoute, async (req, res) => {

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
        console.log("error in update route", error.message);
    }
});


export default router;


// import express from 'express';
// import Product from '../models/Product.js';
// import { proctedRoute } from '../utils/protectedRoute.js';

// const router = express.Router();

// // Create Product
// router.post('/', auth, async (req, res) => {
//   const { title, description, category, price, imagePlaceholder } = req.body;
//   const product = new Product({
//     title,
//     description,
//     category,
//     price,
//     imagePlaceholder,
//     ownerId: req.user.id
//   });
//   await product.save();
//   res.json(product);
// });

// // Get All Products (with category filter & search)
// router.get('/', async (req, res) => {
//   const { category, search } = req.query;
//   let filter = {};
//   if (category) filter.category = category;
//   if (search) filter.title = { $regex: search, $options: 'i' };
//   const products = await Product.find(filter);
//   res.json(products);
// });

// // Get Product by ID
// router.get('/:id', async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) return res.status(404).json({ message: 'Product not found' });
//   res.json(product);
// });

// // Update Product (owner only)
// router.put('/:id', auth, async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) return res.status(404).json({ message: 'Product not found' });
//   if (product.ownerId.toString() !== req.user.id)
//     return res.status(403).json({ message: 'Unauthorized' });

//   const { title, description, category, price, imagePlaceholder } = req.body;
//   product.title = title;
//   product.description = description;
//   product.category = category;
//   product.price = price;
//   product.imagePlaceholder = imagePlaceholder;
//   await product.save();
//   res.json(product);
// });

// // Delete Product (owner only)
// router.delete('/:id', auth, async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) return res.status(404).json({ message: 'Product not found' });
//   if (product.ownerId.toString() !== req.user.id)
//     return res.status(403).json({ message: 'Unauthorized' });

//   await product.deleteOne();
//   res.json({ message: 'Product deleted' });
// });

// export default router;
