import mongoose from "mongoose";


const connectDB = async (req, res) => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        
        console.log("error in db connection",error.message);
        res.sendStatus(500).json({ message: "something went wrong" });
    }
}

export default connectDB;