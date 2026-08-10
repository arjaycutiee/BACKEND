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
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}