import { prisma } from "@/lib/prisma";

export class DashboardRepository {
  tasksDueOn(userId: string, date: string) {
    return prisma.task.findMany({
      where: { userId, dueDate: date },
      include: { subTasks: true },
      orderBy: [{ completed: "asc" }, { dueTime: "asc" }],
    });
  }

  pendingTasksBetween(userId: string, from: string, to: string) {
    return prisma.task.findMany({
      where: { userId, completed: false, dueDate: { gt: from, lte: to } },
      orderBy: [{ dueDate: "asc" }, { dueTime: "asc" }],
    });
  }

  eventsOn(userId: string, date: string) {
    return prisma.calendarEvent.findMany({
      where: { userId, date },
      include: { checklist: true },
      orderBy: { time: "asc" },
    });
  }

  eventsBetween(userId: string, from: string, to: string) {
    return prisma.calendarEvent.findMany({
      where: { userId, date: { gt: from, lte: to } },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });
  }

  countPendingTasks(userId: string) {
    return prisma.task.count({ where: { userId, completed: false } });
  }

  expensesSince(userId: string, from: string) {
    return prisma.transaction.findMany({
      where: { userId, type: "expense", date: { gte: from } },
    });
  }
}

export const dashboardRepository = new DashboardRepository();
