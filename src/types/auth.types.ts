export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  [key: string]: unknown;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
}