import { Router } from "express";
import { z } from "zod";
import * as authController from "@/controllers/auth.controller";
import { validate } from "@/middleware/validation.middleware";

const router = Router();

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

router.post("/register", validate(registerSchema), authController.register);

export default router;