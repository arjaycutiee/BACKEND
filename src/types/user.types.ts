export interface UserData {
  fullName: string;
  email: string;
  password: string;
}

export const SAFE_USER_SELECT = {
  id: true,
  fullName: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;