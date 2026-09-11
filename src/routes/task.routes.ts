import { Router } from "express";
import { z } from "zod";
import * as taskController from "@/controllers/task.controller";
import { authMiddleware } from "@/middlewares/authenticate-token";
import { validate } from "@/middlewares/validate-schema";

const router = Router();

router.use(authMiddleware);

const subTaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Sub-task title is required"),
  completed: z.boolean().default(false),
});

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  subject: z.string().default("General"),
  category: z.enum(["Academic", "Personal", "Projects", "Exams", "Activities"]),
  priority: z.enum(["High", "Medium", "Low"]),
  difficulty: z.enum(["Hard", "Medium", "Easy"]),
  duration: z.coerce.number().min(0).default(1),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dueDate must be YYYY-MM-DD"),
  dueTime: z.string().regex(/^\d{2}:\d{2}$/, "dueTime must be HH:MM"),
  completed: z.boolean().default(false),
  hasReminder: z.boolean().default(false),
  repeat: z.enum(["None", "Daily", "Weekly", "Monthly"]).default("None"),
  isPinned: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
  attachments: z.coerce.number().int().min(0).default(0),
  subTasks: z.array(subTaskSchema).default([]),
});

router.get("/", taskController.getTasks);
router.post("/", validate(taskSchema), taskController.createTask);
router.put("/:id", validate(taskSchema.partial()), taskController.updateTask);
router.patch("/:id/toggle", taskController.toggleTask);
router.delete("/:id", taskController.deleteTask);

export default router;
