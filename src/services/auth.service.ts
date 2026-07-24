import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository";
import { RegisterInput } from "@/types/auth.types";
import { AppError } from "@/utils/response";

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
}

export const authService = new AuthService();