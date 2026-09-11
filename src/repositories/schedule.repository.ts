import { prisma } from "@/lib/prisma";
import { EventInput, EventUpdateInput } from "@/types/schedule.types";

const eventInclude = { checklist: true } as const;

export class ScheduleRepository {
  findAllByUser(userId: string, date?: string) {
    return prisma.calendarEvent.findMany({
      where: { userId, ...(date ? { date } : {}) },
      include: eventInclude,
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });
  }

  findById(id: string, userId: string) {
    return prisma.calendarEvent.findFirst({ where: { id, userId }, include: eventInclude });
  }

  create(userId: string, data: EventInput) {
    const { checklist, ...event } = data;
    return prisma.calendarEvent.create({
      data: {
        ...event,
        userId,
        checklist: {
          create: (checklist ?? []).map((c) => ({
            text: c.text,
            completed: c.completed ?? false,
          })),
        },
      },
      include: eventInclude,
    });
  }

  async update(id: string, data: EventUpdateInput) {
    const { checklist, ...event } = data;

    if (checklist) {
      await prisma.checklistItem.deleteMany({ where: { eventId: id } });
    }

    return prisma.calendarEvent.update({
      where: { id },
      data: {
        ...event,
        ...(checklist
          ? {
              checklist: {
                create: checklist.map((c) => ({
                  text: c.text,
                  completed: c.completed ?? false,
                })),
              },
            }
          : {}),
      },
      include: eventInclude,
    });
  }

  updateChecklistItem(itemId: string, data: { completed: boolean }) {
    return prisma.checklistItem.update({ where: { id: itemId }, data });
  }

  delete(id: string) {
    return prisma.calendarEvent.delete({ where: { id } });
  }
}

export const scheduleRepository = new ScheduleRepository();
