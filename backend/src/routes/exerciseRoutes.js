import express from "express";
import { trackExercise, getUserExercise } from "../controllers/exerciseController.js";
import { verifyUserJWT } from "../middleware.js";

const router = express.Router();

// Protect all exercise routes
router.use(verifyUserJWT);

router.post("/track", trackExercise);
router.get("/progress", getUserExercise);

export default router;