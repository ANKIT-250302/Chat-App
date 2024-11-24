import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  try {
    // Generate the token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    // Set the cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      sameSite: "strict", // Protects against CSRF attacks
      secure: process.env.NODE_ENV !== "development"// Use secure cookies in production
    });
    
    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new Error("Failed to generate token");
  }
};
