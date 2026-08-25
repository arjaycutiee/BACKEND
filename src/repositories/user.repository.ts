import { prisma } from "@/lib/prisma";
import { UserData } from "@/types/user.types";

export class UserRepository {
  async create(data: UserData) {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<UserData>) {
    return prisma.user.update({ where: { id }, data });
  }

  async countStats(userId: string) {
    const [tasks, events, transactions, notes] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.calendarEvent.count({ where: { userId } }),
      prisma.transaction.count({ where: { userId } }),
      prisma.note.count({ where: { userId } }),
    ]);
    return { tasks, events, transactions, notes };
  }
}

export const userRepository = new UserRepository();
