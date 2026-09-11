import { Request, Response } from "express";
import { userService } from "@/services/user.service";
import { asyncHandler } from "@/utils/helper";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getMe(req.user!.userId);
  return res.status(200).json(user);
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateMe(req.user!.userId, req.body);
  return res.status(200).json(user);
});
