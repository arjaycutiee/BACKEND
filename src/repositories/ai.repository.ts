import { prisma } from "@/lib/prisma";
import { addDaysStr, todayStr } from "@/utils/date";

// Gathers the user's real data so the AI can answer questions about it.
// This technique is called "context injection" (a simple form of RAG):
// instead of training the AI on your data, we fetch the relevant data
// per-request and place it inside the prompt.
export class AiRepository {
  async getUserContext(userId: string) {
    const today = todayStr();
    const weekAhead = addDaysStr(today, 7);
    const weekAgo = addDaysStr(today, -7);

    const [user, pendingTasks, upcomingEvents, recentTransactions, notes] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { fullName: true } }),
      prisma.task.findMany({
        where: { userId, completed: false },
        orderBy: [{ dueDate: "asc" }, { dueTime: "asc" }],
        take: 20,
      }),
      prisma.calendarEvent.findMany({
        where: { userId, date: { gte: today, lte: weekAhead } },
        orderBy: [{ date: "asc" }, { time: "asc" }],
        take: 20,
      }),
      prisma.transaction.findMany({
        where: { userId, date: { gte: weekAgo } },
        orderBy: { date: "desc" },
        take: 20,
      }),
      prisma.note.findMany({
        where: { userId, isArchived: false },
        select: { title: true, category: true, tags: true },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
    ]);

    return { user, today, pendingTasks, upcomingEvents, recentTransactions, notes };
  }
}

export const aiRepository = new AiRepository();
