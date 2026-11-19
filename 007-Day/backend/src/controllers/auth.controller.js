import {
  getUserById,
  loginUser,
  registerUser,
} from "../services/auth.service.js";
import { generateToken } from "../utils/generateToken.js";

const sessionDurationMs = 24 * 60 * 60 * 1000;

function sessionCookieOptions(secure) {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: sessionDurationMs,
  };
}

function setSessionCookie(res, accessToken, secure) {
  res.cookie("session", accessToken, sessionCookieOptions(secure));
}

export function createAuthController({ jwtSecret, cookieSecure }) {
  return {
    async register(req, res, next) {
      try {
        const result = await registerUser(req.validatedBody, jwtSecret);
        setSessionCookie(res, result.accessToken, cookieSecure);
        return res.status(201).json(result);
      } catch (error) {
        return next(error);
      }
    },

    async login(req, res, next) {
      try {
        const result = await loginUser(req.validatedBody, jwtSecret);
        setSessionCookie(res, result.accessToken, cookieSecure);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    },

    logout(_req, res) {
      res.clearCookie("session", {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: "lax",
        path: "/",
      });
      return res.json({ message: "You have been signed out." });
    },

    async me(req, res, next) {
      try {
        const user = await getUserById(req.auth.userId);
        if (!user) {
          return res.status(401).json({
            message: "Your session is no longer valid. Please sign in again.",
          });
        }
        const accessToken = generateToken(user.id, jwtSecret);
        setSessionCookie(res, accessToken, cookieSecure);
        return res.json({ user, accessToken });
      } catch (error) {
        return next(error);
      }
    },
  };
}
