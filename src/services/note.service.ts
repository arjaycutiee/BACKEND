import { noteRepository } from "@/repositories/note.repository";
import { taskRepository } from "@/repositories/task.repository";
import { scheduleRepository } from "@/repositories/schedule.repository";
import { NoteInput, NoteUpdateInput } from "@/types/note.types";
import { TaskUpdateInput } from "@/types/task.types";
import { EventUpdateInput } from "@/types/schedule.types";
import { AppError } from "@/utils/response";
import { todayStr } from "@/utils/date";

export class NoteService {
  getNotes(userId: string, archived?: boolean) {
    return noteRepository.findAllByUser(userId, archived);
  }

  createNote(userId: string, input: NoteInput) {
    return noteRepository.create(userId, input);
  }

  async updateNote(userId: string, noteId: string, input: NoteUpdateInput) {
    await this.ensureOwned(userId, noteId);
    return noteRepository.update(noteId, input);
  }

  async toggleFlag(userId: string, noteId: string, flag: "isFavorite" | "isPinned" | "isArchived") {
    const note = await this.ensureOwned(userId, noteId);
    return noteRepository.update(noteId, { [flag]: !note[flag] });
  }

  async deleteNote(userId: string, noteId: string) {
    await this.ensureOwned(userId, noteId);
    await noteRepository.delete(noteId);
    return { message: "Note deleted" };
  }

  // Mirrors localDb.convertNoteToTask() in the frontend
  async convertToTask(userId: string, noteId: string, overrides: TaskUpdateInput = {}) {
    const note = await this.ensureOwned(userId, noteId);

    let taskCategory = "Academic";
    if (note.category === "Personal") taskCategory = "Personal";
    else if (note.category === "Projects") taskCategory = "Projects";
    else if (note.category === "Review") taskCategory = "Exams";
    else if (note.category === "Ideas") taskCategory = "Activities";

    const description =
      `Converted from Note "${note.title}":\n\n` +
      (note.content.length > 200 ? note.content.substring(0, 197) + "..." : note.content);

    return taskRepository.create(userId, {
      title: overrides.title ?? note.title,
      description: overrides.description ?? description,
      subject: overrides.subject ?? (note.tags[0] ? note.tags[0].replace("#", "") : "General"),
      category: overrides.category ?? taskCategory,
      priority: overrides.priority ?? (note.isPinned ? "High" : "Medium"),
      difficulty: overrides.difficulty ?? "Medium",
      duration: overrides.duration ?? 1.5,
      dueDate: overrides.dueDate ?? todayStr(),
      dueTime: overrides.dueTime ?? "18:00",
      completed: false,
      hasReminder: overrides.hasReminder ?? true,
      repeat: overrides.repeat ?? "None",
      isPinned: note.isPinned,
      isFavorite: note.isFavorite,
      attachments: 1,
      subTasks: [],
    });
  }

  // Mirrors localDb.linkNoteToSchedule() in the frontend
  async scheduleNote(userId: string, noteId: string, overrides: EventUpdateInput = {}) {
    const note = await this.ensureOwned(userId, noteId);

    let eventCategory = "AI Study";
    if (note.category === "School" || note.category === "Study Note") eventCategory = "Class";
    else if (note.category === "Review") eventCategory = "Exam";
    else if (note.category === "Projects") eventCategory = "Assignment";
    else if (note.category === "Personal") eventCategory = "Personal";

    return scheduleRepository.create(userId, {
      title: overrides.title ?? `Study: ${note.title}`,
      category: overrides.category ?? eventCategory,
      date: overrides.date ?? todayStr(),
      time: overrides.time ?? "15:00",
      duration: overrides.duration ?? 60,
      priority: overrides.priority ?? (note.isPinned ? "High" : "Medium"),
      isAllDay: false,
      hasReminder: true,
      reminderTime: "15 minutes before",
      isRecurring: false,
      recurrenceRule: "",
      progress: 0,
      checklist: [],
      description: `Note reference: "${note.title}". ${note.content.substring(0, 150)}...`,
    });
  }

  private async ensureOwned(userId: string, noteId: string) {
    const note = await noteRepository.findById(noteId, userId);
    if (!note) throw new AppError("Note not found", 404);
    return note;
  }
}

export const noteService = new NoteService();
