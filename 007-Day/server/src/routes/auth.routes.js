import { Router } from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";
import conversationController from "../controllers/conversation.controller.js";

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

router.post(
  "/conversation",
  protectRoute,
  conversationController.handleMessage,
);

router.get(
  "/get-all-conversation",
  protectRoute,
  conversationController.getAllConversations,
);
router.get(
  "/get-all-messages/:conversationId",
  protectRoute,
  conversationController.getAllMessages,
);

export default router;
