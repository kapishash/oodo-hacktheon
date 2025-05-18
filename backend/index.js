import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./lib/db.js";
import userRouter from "./routes/auth.js";

const app = express();

dotenv.config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// router
app.use("/api/auth", userRouter);



connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("error in db connection", error.message);
  });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// })
