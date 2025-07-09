import { Router } from "express";
import { getUserReports, getDashboardStats, diagnose } from "../controllers/reportController.js";
import { verifyUserJWT, upload } from "../middleware.js";

const router = Router();

router.get("/", verifyUserJWT, getUserReports);
router.get("/dashboard-stats", verifyUserJWT, getDashboardStats);
router.post("/diagnose", verifyUserJWT, upload.single("audio"), diagnose);

export default router;