import { Router } from "express";
import { z } from "zod";
import * as aiController from "@/controllers/ai.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validation.middleware";

const router = Router();

router.use(authMiddleware);

const chatSchema = z.object({
  message: z.string().min(1, "Message is required").max(2000, "Message is too long"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        text: z.string().min(1),
      })
    )
    .max(20)
    .default([]),
});

router.post("/chat", validate(chatSchema), aiController.chat);

export default router;
