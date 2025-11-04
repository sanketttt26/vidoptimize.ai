import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vidoptimize_jwt_secret_key_2025';

export const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
