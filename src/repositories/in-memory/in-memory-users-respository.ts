import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public inMemoryRegisters: User[] = [];
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };
    this.inMemoryRegisters.push(user);
    return user;
  }

  async findByEmail(email: string) {
    const user = this.inMemoryRegisters.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findById(id: string) {
    const user = this.inMemoryRegisters.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    return user;
  }
}
