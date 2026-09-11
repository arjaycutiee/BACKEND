export interface NoteInput {
  title: string;
  content?: string;
  category?: string; // School | Personal | Projects | Review | Ideas | Study Note
  tags?: string[];
  isFavorite?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  colorAccent?: string;
}

export type NoteUpdateInput = Partial<NoteInput>;
