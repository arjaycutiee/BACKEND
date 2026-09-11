import { Router } from "express";
import { z } from "zod";
import * as noteController from "@/controllers/note.controller";
import { authMiddleware } from "@/middlewares/authenticate-token";
import { validate } from "@/middlewares/validate-schema";

const router = Router();

router.use(authMiddleware);

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().default(""),
  category: z.string().default("Personal"),
  tags: z.array(z.string()).default([]),
  isFavorite: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  colorAccent: z.string().optional(),
});

router.get("/", noteController.getNotes);
router.post("/", validate(noteSchema), noteController.createNote);
router.put("/:id", validate(noteSchema.partial()), noteController.updateNote);
router.patch("/:id/favorite", noteController.toggleFavorite);
router.patch("/:id/pin", noteController.togglePin);
router.patch("/:id/archive", noteController.toggleArchive);
router.delete("/:id", noteController.deleteNote);
router.post("/:id/convert-to-task", noteController.convertToTask);
router.post("/:id/schedule", noteController.scheduleNote);

export default router;
