import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Access the JWT token from cookies
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database using the decoded token's userId
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Attach the user object to the request for further use
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error.message);

    // Handle specific JWT errors for better clarity
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    // Generic server error response
    res.status(500).json({ message: "Internal server error" });
  }
};
