import express, { Application } from "express";
import cors from "cors";
import routes from "@/routes";
import { errorMiddleware } from "@/middlewares/error.middleware";
import { notFoundMiddleware } from "@/middlewares/notFound.middleware";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware); // dapat naa ni sa last

export default app;
