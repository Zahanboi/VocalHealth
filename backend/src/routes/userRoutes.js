import { Router } from "express";
import {
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser
} from "../controllers/userController.js";

import { verifyUserJWT } from "../middleware.js";

const router = Router();

// Authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyUserJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken); // Fixed route path

export default router;