import mongoose from "mongoose";
const connectDB= async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(conn.connection.host);
        
    } catch (error) {
        console.log(error);
        
    }
}

export default connectDB;