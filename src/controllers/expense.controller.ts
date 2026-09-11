import { Request, Response } from "express";
import { expenseService } from "@/services/expense.service";
import { asyncHandler } from "@/utils/helper";

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const type = typeof req.query.type === "string" ? req.query.type : undefined;
  const transactions = await expenseService.getTransactions(req.user!.userId, type);
  return res.status(200).json(transactions);
});

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await expenseService.createTransaction(req.user!.userId, req.body);
  return res.status(201).json(transaction);
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  const result = await expenseService.deleteTransaction(req.user!.userId, req.params.id as string);
  return res.status(200).json(result);
});

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await expenseService.getSummary(req.user!.userId);
  return res.status(200).json(summary);
});
