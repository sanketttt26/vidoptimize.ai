import express from "express";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { dataService } from "../services/dataService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

function normalizeUser(user) {
  if (!user) return null;
  const obj =
    typeof user.toObject === "function" ? user.toObject() : { ...user };
  const id = obj.id || (obj._id ? obj._id.toString() : undefined);
  if (id) obj.id = id;
  delete obj._id;
  return obj;
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await dataService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (persist to DB)
    const created = await dataService.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const userObj = normalizeUser(created);

    // Generate tokens
    const accessToken = generateAccessToken(userObj.id, userObj.email);
    const refreshToken = generateRefreshToken(userObj.id, userObj.email);

    // Persist refresh token
    await dataService.updateUser(userObj.id, { refresh_token: refreshToken });

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Return user without password
    const { password: _, ...userWithoutPassword } = userObj;

    res.status(201).json({
      message: "Registration successful",
      token: accessToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user (from DB)
    const user = await dataService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const userObj = normalizeUser(user);

    // Generate tokens
    const accessToken = generateAccessToken(userObj.id, userObj.email);
    const refreshToken = generateRefreshToken(userObj.id, userObj.email);

    // Persist refresh token
    await dataService.updateUser(userObj.id, { refresh_token: refreshToken });

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Return user without password
    const { password: _, ...userWithoutPassword } = userObj;

    res.json({
      message: "Login successful",
      token: accessToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Refresh access token (rotate refresh token)
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ error: "No refresh token" });

    const payload = verifyRefreshToken(refreshToken);
    if (!payload)
      return res
        .status(403)
        .json({ error: "Invalid or expired refresh token" });

    // Find user by stored refresh token
    const storedUser = await dataService.findUserByRefreshToken(refreshToken);
    if (!storedUser)
      return res.status(403).json({ error: "Refresh token not recognized" });

    // Rotate tokens
    const userObj = normalizeUser(storedUser);
    const newAccessToken = generateAccessToken(userObj.id, userObj.email);
    const newRefreshToken = generateRefreshToken(userObj.id, userObj.email);

    // Persist new refresh token
    await dataService.updateUser(userObj.id, {
      refresh_token: newRefreshToken,
    });

    // Set cookie
    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    const { password: _, ...userWithoutPassword } = userObj;
    res.json({ token: newAccessToken, user: userWithoutPassword });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ error: "Failed to refresh token" });
  }
});

// Get profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await dataService.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userObj = normalizeUser(user);
    const { password: _, ...userWithoutPassword } = userObj;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// Logout (clears refresh token cookie and server-side stored token)
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // remove stored refresh token for user
    await dataService.updateUser(req.user.userId, { refresh_token: null });
    // clear cookie
    res.clearCookie("refreshToken", cookieOptions);
    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
});

export default router;
