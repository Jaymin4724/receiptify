import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user without password
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error.message);
    res.status(401).json({ message: "Unauthorized, invalid or expired token" });
  }
};

export default authMiddleware;
