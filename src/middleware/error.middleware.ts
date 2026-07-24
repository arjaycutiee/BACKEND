import { NextFunction, Request, Response } from "express";
import { AppError, sendError } from "@/utils/response";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  console.error(err);
  return sendError(res, "Something went wrong. Please try again later.", 500);
}