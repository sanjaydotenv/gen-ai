import { Router } from "express";
import { createAuthController } from "../controllers/auth.controller.js";
import {
  loginSchema,
  registerSchema,
  requireAuth,
  validate,
} from "../middleware/auth.middleware.js";

export function createAuthRouter({ jwtSecret, cookieSecure }) {
  const router = Router();
  const controller = createAuthController({ jwtSecret, cookieSecure });

  router.post("/register", validate(registerSchema), controller.register);
  router.post("/login", validate(loginSchema), controller.login);
  router.post("/logout", controller.logout);
  router.get("/me", requireAuth(jwtSecret), controller.me);

  return router;
}
