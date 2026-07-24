import { Request, Response } from "express";
import { authService } from "@/services/auth.service";
import { sendSuccess } from "@/utils/response";
import { asyncHandler } from "@/utils/helper";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  return sendSuccess(res, "Account created successfully", user, 201);
});