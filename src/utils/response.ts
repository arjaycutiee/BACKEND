import { Response } from "express";

export function sendSuccess<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function sendError(res: Response, message: string, statusCode = 400, errors?: unknown) {
  return res.status(statusCode).json({ success: false, message, errors });
}

export class AppError extends Error {
  statusCode: number;
  errors?: unknown;

  constructor(message: string, statusCode = 400, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}