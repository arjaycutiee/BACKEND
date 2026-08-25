import { Request, Response } from "express";
import { noteService } from "@/services/note.service";
import { asyncHandler } from "@/utils/helper";

export const getNotes = asyncHandler(async (req: Request, res: Response) => {
  const archived =
    req.query.archived === "true" ? true : req.query.archived === "false" ? false : undefined;
  const notes = await noteService.getNotes(req.user!.userId, archived);
  return res.status(200).json(notes);
});

export const createNote = asyncHandler(async (req: Request, res: Response) => {
  const note = await noteService.createNote(req.user!.userId, req.body);
  return res.status(201).json(note);
});

export const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const note = await noteService.updateNote(req.user!.userId, req.params.id as string, req.body);
  return res.status(200).json(note);
});

export const toggleFavorite = asyncHandler(async (req: Request, res: Response) => {
  const note = await noteService.toggleFlag(req.user!.userId, req.params.id as string, "isFavorite");
  return res.status(200).json(note);
});

export const togglePin = asyncHandler(async (req: Request, res: Response) => {
  const note = await noteService.toggleFlag(req.user!.userId, req.params.id as string, "isPinned");
  return res.status(200).json(note);
});

export const toggleArchive = asyncHandler(async (req: Request, res: Response) => {
  const note = await noteService.toggleFlag(req.user!.userId, req.params.id as string, "isArchived");
  return res.status(200).json(note);
});

export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const result = await noteService.deleteNote(req.user!.userId, req.params.id as string);
  return res.status(200).json(result);
});

export const convertToTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await noteService.convertToTask(req.user!.userId, req.params.id as string, req.body);
  return res.status(201).json(task);
});

export const scheduleNote = asyncHandler(async (req: Request, res: Response) => {
  const event = await noteService.scheduleNote(req.user!.userId, req.params.id as string, req.body);
  return res.status(201).json(event);
});
