import { Router } from "express";
import { z } from "zod";
import * as scheduleController from "@/controllers/schedule.controller";
import { authMiddleware } from "@/middlewares/authenticate-token";
import { validate } from "@/middlewares/validate-schema";

const router = Router();

router.use(authMiddleware);

const checklistItemSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Checklist text is required"),
  completed: z.boolean().default(false),
});

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum([
    "Assignment",
    "Exam",
    "Class",
    "Meeting",
    "Personal",
    "AI Study",
  ]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "time must be HH:MM"),
  duration: z.coerce.number().int().min(0).default(60),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
  isAllDay: z.boolean().default(false),
  hasReminder: z.boolean().default(false),
  reminderTime: z.string().default(""),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().default(""),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  description: z.string().optional(),
  isAIScheduled: z.boolean().default(false),
  checklist: z.array(checklistItemSchema).default([]),
});

router.get("/", scheduleController.getEvents);
router.post("/", validate(eventSchema), scheduleController.createEvent);
router.put(
  "/:id",
  validate(eventSchema.partial()),
  scheduleController.updateEvent,
);
router.patch(
  "/:id/checklist/:itemId/toggle",
  scheduleController.toggleChecklistItem,
);
router.delete("/:id", scheduleController.deleteEvent);

export default router;
