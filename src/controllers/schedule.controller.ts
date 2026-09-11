import { Request, Response } from "express";
import { scheduleService } from "@/services/schedule.service";
import { asyncHandler } from "@/utils/helper";

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const date = typeof req.query.date === "string" ? req.query.date : undefined;
  const events = await scheduleService.getEvents(req.user!.userId, date);
  return res.status(200).json(events);
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await scheduleService.createEvent(req.user!.userId, req.body);
  return res.status(201).json(event);
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await scheduleService.updateEvent(req.user!.userId, req.params.id as string, req.body);
  return res.status(200).json(event);
});

export const toggleChecklistItem = asyncHandler(async (req: Request, res: Response) => {
  const event = await scheduleService.toggleChecklistItem(
    req.user!.userId,
    req.params.id as string,
    req.params.itemId as string
  );
  return res.status(200).json(event);
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const result = await scheduleService.deleteEvent(req.user!.userId, req.params.id as string);
  return res.status(200).json(result);
});
