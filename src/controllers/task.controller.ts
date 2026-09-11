import { Request, Response } from "express";
import { taskService } from "@/services/task.service";
import { asyncHandler } from "@/utils/helper";

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await taskService.getTasks(req.user!.userId);
  return res.status(200).json(tasks);
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.user!.userId, req.body);
  return res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.updateTask(req.user!.userId, req.params.id as string, req.body);
  return res.status(200).json(task);
});

export const toggleTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.toggleTask(req.user!.userId, req.params.id as string);
  return res.status(200).json(task);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const result = await taskService.deleteTask(req.user!.userId, req.params.id as string);
  return res.status(200).json(result);
});
