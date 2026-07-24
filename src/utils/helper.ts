import { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
/** Mag-generate ug random URL-safe token (para sa refresh tokens) */
export function generateRandomToken(bytes = 48): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/** One-way hash para sa pag-store sa tokens sa DB */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}