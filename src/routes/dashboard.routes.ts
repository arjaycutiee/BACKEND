import { Router } from "express";
import * as dashboardController from "@/controllers/dashboard.controller";
import { authMiddleware } from "@/middlewares/authenticate-token";

const router = Router();

router.use(authMiddleware);

router.get("/summary", dashboardController.getSummary);

export default router;
