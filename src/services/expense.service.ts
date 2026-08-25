import { expenseRepository } from "@/repositories/expense.repository";
import { TransactionInput, WalletSummary } from "@/types/wallet.types";
import { AppError } from "@/utils/response";

export class ExpenseService {
  getTransactions(userId: string, type?: string) {
    return expenseRepository.findAllByUser(userId, type);
  }

  createTransaction(userId: string, input: TransactionInput) {
    return expenseRepository.create(userId, input);
  }

  async deleteTransaction(userId: string, id: string) {
    const tx = await expenseRepository.findById(id, userId);
    if (!tx) throw new AppError("Transaction not found", 404);
    await expenseRepository.delete(id);
    return { message: "Transaction deleted" };
  }

  async getSummary(userId: string): Promise<WalletSummary> {
    const txs = await expenseRepository.findAllByUser(userId);
    const totalIncome = txs
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = txs
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  }
}

export const expenseService = new ExpenseService();
