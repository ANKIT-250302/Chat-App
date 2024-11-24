import express from "express";
import dotenv from "dotenv";
import authRoutes from './routes/auth.route.js'
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser"
dotenv.config();
connectDB();
const app = express();
const PORT =process.env.PORT;
app.use(cookieParser())
app.use(express.json())
app.use("/api/auth",authRoutes);

app.listen(PORT,()=>{
console.log("Server AT : http://localhost:5001");

})