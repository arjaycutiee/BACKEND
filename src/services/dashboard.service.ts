import { dashboardRepository } from "@/repositories/dashboard.repository";
import { addDaysStr, todayStr } from "@/utils/date";

export class DashboardService {
  async getSummary(userId: string) {
    const today = todayStr();
    const weekAhead = addDaysStr(today, 7);
    const weekAgo = addDaysStr(today, -7);

    const [todaysTasks, upcomingTasks, todaysSchedule, upcomingEvents, pendingTasks, weekExpensesTxs] =
      await Promise.all([
        dashboardRepository.tasksDueOn(userId, today),
        dashboardRepository.pendingTasksBetween(userId, today, weekAhead),
        dashboardRepository.eventsOn(userId, today),
        dashboardRepository.eventsBetween(userId, today, weekAhead),
        dashboardRepository.countPendingTasks(userId),
        dashboardRepository.expensesSince(userId, weekAgo),
      ]);

    const upcomingDeadlines = [
      ...upcomingTasks.map((t) => ({
        id: t.id,
        title: t.title,
        type: "task" as const,
        date: t.dueDate,
        time: t.dueTime,
        priority: t.priority,
      })),
      ...upcomingEvents.map((e) => ({
        id: e.id,
        title: e.title,
        type: "event" as const,
        date: e.date,
        time: e.time,
        priority: e.priority,
      })),
    ].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

    const weekExpenses = weekExpensesTxs.reduce((sum, t) => sum + t.amount, 0);

    return {
      todaysTasks,
      upcomingDeadlines,
      todaysSchedule,
      quickOverview: {
        pendingTasks,
        todaysEvents: todaysSchedule.length,
        weekExpenses,
      },
    };
  }
}

export const dashboardService = new DashboardService();
