import { prisma } from "@/lib/prisma";
import { NoteInput, NoteUpdateInput } from "@/types/note.types";

export class NoteRepository {
  findAllByUser(userId: string, archived?: boolean) {
    return prisma.note.findMany({
      where: { userId, ...(archived !== undefined ? { isArchived: archived } : {}) },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    });
  }

  findById(id: string, userId: string) {
    return prisma.note.findFirst({ where: { id, userId } });
  }

  create(userId: string, data: NoteInput) {
    return prisma.note.create({ data: { ...data, userId } });
  }

  update(id: string, data: NoteUpdateInput) {
    return prisma.note.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.note.delete({ where: { id } });
  }
}

export const noteRepository = new NoteRepository();
