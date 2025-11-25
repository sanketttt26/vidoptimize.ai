import { verifyAccessToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = verifyAccessToken(token);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found or account disabled." });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token." });
    }
    console.error("Auth middleware error:", err);
    return res.status(500).json({ error: "Authentication error" });
  }
};
