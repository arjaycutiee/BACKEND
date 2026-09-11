import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { sendError } from "@/utils/response";

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return sendError(res, "Validation failed", 422, err.flatten().fieldErrors);
      }
      next(err);
    }
  };
}