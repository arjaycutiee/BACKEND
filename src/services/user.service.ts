import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository";
import { AppError } from "@/utils/response";

const SALT_ROUNDS = 10;

export class UserService {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const stats = await userRepository.countStats(userId);

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      stats,
    };
  }

  async updateMe(userId: string, input: { fullName?: string; password?: string }) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const data: { fullName?: string; password?: string } = {};
    if (input.fullName) data.fullName = input.fullName;
    if (input.password) data.password = await bcrypt.hash(input.password, SALT_ROUNDS);

    const updated = await userRepository.update(userId, data);

    return {
      id: updated.id,
      fullName: updated.fullName,
      email: updated.email,
    };
  }
}

export const userService = new UserService();
