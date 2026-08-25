import { Router } from "express";
import { z } from "zod";
import * as userController from "@/controllers/user.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validation.middleware";

const router = Router();

router.use(authMiddleware);

const updateMeSchema = z.object({
  fullName: z.string().min(1).optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

router.get("/me", userController.getMe);
router.put("/me", validate(updateMeSchema), userController.updateMe);

export default router;
