import { Router } from "express";
import { z } from "zod";
import * as expenseController from "@/controllers/expense.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validation.middleware";

const router = Router();

router.use(authMiddleware);

const transactionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  type: z.enum(["income", "expense"]),
});

router.get("/", expenseController.getTransactions);
router.get("/summary", expenseController.getSummary);
router.post("/", validate(transactionSchema), expenseController.createTransaction);
router.delete("/:id", expenseController.deleteTransaction);

export default router;
