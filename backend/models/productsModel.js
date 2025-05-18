import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    ceratedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        required: true,
    },

},
{timestamps: true}
);

const Product = mongoose.model("Product", productSchema);

export default Product;
