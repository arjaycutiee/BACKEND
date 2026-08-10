import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository";
import { authRepository } from "@/repositories/auth.repository";
import { RegisterInput, LoginInput, LoginResponse } from "@/types/auth.types";
import { AppError } from "@/utils/response";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";

const SALT_ROUNDS = 10;

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError("An account with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await userRepository.create({
      fullName: input.fullName,
      email: input.email,
      password: hashedPassword,
    });

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const { password: _password, ...safeUser } = user;

    return {
      user: safeUser,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export const authService = new AuthService();