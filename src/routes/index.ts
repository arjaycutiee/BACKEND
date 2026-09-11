import { Router } from "express";
import aiRoutes from "./ai.routes";
import authRoutes from "./auth.routes";
import dashboardRoutes from "./dashboard.routes";
import expenseRoutes from "./expense.routes";
import noteRoutes from "./note.routes";
import scheduleRoutes from "./schedule.routes";
import taskRoutes from "./task.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use("/events", scheduleRoutes);
router.use("/transactions", expenseRoutes);
router.use("/notes", noteRoutes);
router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/ai", aiRoutes);

export default router;
