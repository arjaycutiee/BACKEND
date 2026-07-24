import { Request, Response } from "express";
import { authService } from "@/services/auth.service";
import { sendSuccess } from "@/utils/response";
import { asyncHandler } from "@/utils/helper";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  return sendSuccess(res, "Account created successfully", result, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, "Logged in successfully", result);
});