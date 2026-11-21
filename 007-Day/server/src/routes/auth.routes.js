import { Router } from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";

import protectRoute from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", protectRoute, logoutUser);

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

export default router;
