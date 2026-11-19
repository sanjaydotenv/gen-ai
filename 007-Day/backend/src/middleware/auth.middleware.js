import jwt from "jsonwebtoken";
import { z } from "zod";

export function requireAuth(jwtSecret) {
  return (req, res, next) => {
    const authorization = req.get("Authorization");
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : null;
    const token = bearerToken || req.cookies?.session;

    if (!token) {
      return res.status(401).json({ message: "Please sign in to continue." });
    }

    try {
      const payload = jwt.verify(token, jwtSecret);
      req.auth = { userId: payload.sub };
      return next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          message: "Your session has expired. Please sign in again.",
        });
      }
      return next(error);
    }
  };
}

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(254),
  password: z.string().min(8, "Password must be at least 8 characters.").max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(254),
  password: z.string().min(1, "Enter your password.").max(72),
});

export function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Please check the information you entered.",
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    if (parsed.data.password && Buffer.byteLength(parsed.data.password, "utf8") > 72) {
      return res.status(400).json({
        message: "Please use a password of no more than 72 bytes.",
        errors: { password: ["Password must be no more than 72 bytes."] },
      });
    }
    req.validatedBody = parsed.data;
    return next();
  };
}
