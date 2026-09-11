import { prisma } from "@/lib/prisma";
import { TransactionInput } from "@/types/wallet.types";

export class ExpenseRepository {
  findAllByUser(userId: string, type?: string) {
    return prisma.transaction.findMany({
      where: { userId, ...(type ? { type } : {}) },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
  }

  findById(id: string, userId: string) {
    return prisma.transaction.findFirst({ where: { id, userId } });
  }

  create(userId: string, data: TransactionInput) {
    return prisma.transaction.create({ data: { ...data, userId } });
  }

  delete(id: string) {
    return prisma.transaction.delete({ where: { id } });
  }
}

export const expenseRepository = new ExpenseRepository();
