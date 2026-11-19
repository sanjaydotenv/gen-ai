import jwt from "jsonwebtoken";

export function generateToken(userId, jwtSecret) {
  return jwt.sign({}, jwtSecret, {
    subject: String(userId),
    expiresIn: "1d",
  });
}
