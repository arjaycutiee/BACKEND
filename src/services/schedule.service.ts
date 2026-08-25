import { scheduleRepository } from "@/repositories/schedule.repository";
import { EventInput, EventUpdateInput } from "@/types/schedule.types";
import { AppError } from "@/utils/response";

export class ScheduleService {
  getEvents(userId: string, date?: string) {
    return scheduleRepository.findAllByUser(userId, date);
  }

  createEvent(userId: string, input: EventInput) {
    return scheduleRepository.create(userId, input);
  }

  async updateEvent(userId: string, eventId: string, input: EventUpdateInput) {
    await this.ensureOwned(userId, eventId);
    return scheduleRepository.update(eventId, input);
  }

  async toggleChecklistItem(userId: string, eventId: string, itemId: string) {
    const event = await this.ensureOwned(userId, eventId);
    const item = event.checklist.find((c) => c.id === itemId);
    if (!item) throw new AppError("Checklist item not found", 404);

    await scheduleRepository.updateChecklistItem(itemId, { completed: !item.completed });
    return scheduleRepository.findById(eventId, userId);
  }

  async deleteEvent(userId: string, eventId: string) {
    await this.ensureOwned(userId, eventId);
    await scheduleRepository.delete(eventId);
    return { message: "Event deleted" };
  }

  private async ensureOwned(userId: string, eventId: string) {
    const event = await scheduleRepository.findById(eventId, userId);
    if (!event) throw new AppError("Event not found", 404);
    return event;
  }
}

export const scheduleService = new ScheduleService();
