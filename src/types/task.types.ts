export interface SubTaskInput {
  id?: string;
  title: string;
  completed?: boolean;
}

export interface TaskInput {
  title: string;
  description?: string;
  subject?: string;
  category: string; // Academic | Personal | Projects | Exams | Activities
  priority: string; // High | Medium | Low
  difficulty: string; // Hard | Medium | Easy
  duration?: number; // hours
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  completed?: boolean;
  hasReminder?: boolean;
  repeat?: string; // None | Daily | Weekly | Monthly
  isPinned?: boolean;
  isFavorite?: boolean;
  attachments?: number;
  subTasks?: SubTaskInput[];
}

export type TaskUpdateInput = Partial<TaskInput>;
