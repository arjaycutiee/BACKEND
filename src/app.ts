import express, { Application } from "express";
import cors from "cors";
import authRoutes from "@/routes/auth.routes";
import taskRoutes from "@/routes/task.routes";
import scheduleRoutes from "@/routes/schedule.routes";
import expenseRoutes from "@/routes/expense.routes";
import noteRoutes from "@/routes/note.routes";
import userRoutes from "@/routes/user.routes";
import dashboardRoutes from "@/routes/dashboard.routes";
import aiRoutes from "@/routes/ai.routes";
import { errorMiddleware } from "@/middleware/error.middleware";
import { notFoundMiddleware } from "@/middleware/notFound.middleware";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/events", scheduleRoutes);
app.use("/api/transactions", expenseRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware); // dapat naa ni sa last

export default app;
