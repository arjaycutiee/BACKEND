import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository";
import { authRepository } from "@/repositories/auth.repository";
import { RegisterInput, LoginInput, LoginResponse } from "@/types/auth.types";
import { AppError } from "@/utils/response";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";
import { env } from "@/config/env";

const SALT_ROUNDS = 10;

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError("Email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await userRepository.create({
      fullName: input.fullName,
      email: input.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    };
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

    const token = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await authRepository.findUserByEmail(email);

    // Only generate a token if the user exists, but ALWAYS return the same
    // generic message so attackers can't discover which emails are registered.
    if (user) {
      const resetToken = generateAccessToken({ userId: user.id, email: user.email });
      // TODO: send this by email once an email provider is added.
      // For now it is logged so you can test the flow during development.
      console.log(`🔑 Password reset link for ${email}:`);
      console.log(`${env.CLIENT_URL}/reset-password?token=${resetToken}`);
    }

    return { message: "If that email is registered, a reset link has been sent." };
  }
}

export const authService = new AuthService();
