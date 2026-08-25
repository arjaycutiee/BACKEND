export interface ChecklistItemInput {
  id?: string;
  text: string;
  completed?: boolean;
}

export interface EventInput {
  title: string;
  category: string; // Assignment | Exam | Class | Meeting | Personal | AI Study
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration?: number; // minutes
  priority?: string; // High | Medium | Low
  isAllDay?: boolean;
  hasReminder?: boolean;
  reminderTime?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
  progress?: number;
  description?: string;
  isAIScheduled?: boolean;
  checklist?: ChecklistItemInput[];
}

export type EventUpdateInput = Partial<EventInput>;
