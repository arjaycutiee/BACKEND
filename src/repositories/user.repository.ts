import { prisma } from "@/lib/prisma";
import { UserData } from "@/types/user.types";

export class UserRepository {
  async create(data: UserData) {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
}

export const userRepository = new UserRepository();