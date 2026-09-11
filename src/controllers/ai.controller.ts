import { Request, Response } from "express";
import { aiService } from "@/services/ai.service";
import { asyncHandler } from "@/utils/helper";

export const chat = asyncHandler(async (req: Request, res: Response) => {
  const { message, history } = req.body;
  const result = await aiService.chat(req.user!.userId, message, history);
  return res.status(200).json(result);
});
