import { Request, Response } from "express";
import { dashboardService } from "@/services/dashboard.service";
import { asyncHandler } from "@/utils/helper";

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await dashboardService.getSummary(req.user!.userId);
  return res.status(200).json(summary);
});
