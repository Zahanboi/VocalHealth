import { Router } from "express";
import { getUserReports, getDashboardStats } from "../controllers/reportController.js";
import { verifyUserJWT } from "../middleware.js";

const router = Router();

router.get("/", verifyUserJWT, getUserReports);
router.get("/dashboard-stats", verifyUserJWT, getDashboardStats);

export default router;