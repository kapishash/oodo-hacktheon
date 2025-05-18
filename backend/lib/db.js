import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        
        console.log("error in db connection",error.message);
    }
}

export default connectDB;