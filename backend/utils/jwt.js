import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.warn(
    "Warning: Using default JWT secrets. Set JWT_SECRET and JWT_REFRESH_SECRET in environment for production."
  );
}

export const generateAccessToken = (userId, email) => {
  return jwt.sign({ userId, email }, ACCESS_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId, email) => {
  return jwt.sign({ userId, email }, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};
