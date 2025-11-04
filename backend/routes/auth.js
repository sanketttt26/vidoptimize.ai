import express from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
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

    // Generate token
    const token = generateToken(userObj.id, userObj.email);

    // Return user without password
    const { password: _, ...userWithoutPassword } = userObj;

    res.status(201).json({
      message: "Registration successful",
      token,
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

    // Generate token
    const token = generateToken(userObj.id, userObj.email);

    // Return user without password
    const { password: _, ...userWithoutPassword } = userObj;

    res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
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

// Logout (client-side token removal)
router.post("/logout", authenticateToken, (req, res) => {
  res.json({ message: "Logout successful" });
});

export default router;
