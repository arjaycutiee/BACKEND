import express, { Application } from "express";
import cors from "cors";
import authRoutes from "@/routes/auth.routes";
import { errorMiddleware } from "@/middleware/error.middleware";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorMiddleware); // dapat naa ni sa last

export default app;