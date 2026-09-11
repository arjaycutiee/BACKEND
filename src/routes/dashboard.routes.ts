import { Router } from "express";
import * as dashboardController from "@/controllers/dashboard.controller";
import { authMiddleware } from "@/middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/summary", dashboardController.getSummary);

export default router;
