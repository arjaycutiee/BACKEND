import { prisma } from "@/lib/prisma";
import { TaskInput, TaskUpdateInput } from "@/types/task.types";

const taskInclude = { subTasks: true } as const;

export class TaskRepository {
  findAllByUser(userId: string) {
    return prisma.task.findMany({
      where: { userId },
      include: taskInclude,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });
  }

  findById(id: string, userId: string) {
    return prisma.task.findFirst({ where: { id, userId }, include: taskInclude });
  }

  create(userId: string, data: TaskInput) {
    const { subTasks, ...task } = data;
    return prisma.task.create({
      data: {
        ...task,
        userId,
        subTasks: {
          create: (subTasks ?? []).map((s) => ({
            title: s.title,
            completed: s.completed ?? false,
          })),
        },
      },
      include: taskInclude,
    });
  }

  async update(id: string, data: TaskUpdateInput) {
    const { subTasks, ...task } = data;

    // If subTasks were sent, replace the whole list (same behavior as the frontend editor)
    if (subTasks) {
      await prisma.subTask.deleteMany({ where: { taskId: id } });
    }

    return prisma.task.update({
      where: { id },
      data: {
        ...task,
        ...(subTasks
          ? {
              subTasks: {
                create: subTasks.map((s) => ({
                  title: s.title,
                  completed: s.completed ?? false,
                })),
              },
            }
          : {}),
      },
      include: taskInclude,
    });
  }

  delete(id: string) {
    return prisma.task.delete({ where: { id } });
  }
}

export const taskRepository = new TaskRepository();
