import { Request, Response } from "express";
import { authService } from "@/services/auth.service";
import { asyncHandler } from "@/utils/helper";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  return res.status(201).json(user);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  return res.status(200).json(result);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body.email);
  return res.status(200).json(result);
});
