import { prisma } from "../../config/prisma.ts";
import type { User } from "@prisma/client";

export class UserRepository {
  async createUser(email: string): Promise<User> {
    return prisma.user.create({
      data: { email },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: id },
      include: { transactions: true },
    });
  }
}
