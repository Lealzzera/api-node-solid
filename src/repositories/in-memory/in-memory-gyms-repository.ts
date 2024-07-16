import { Gym } from "@prisma/client";
import { GymsRepository } from "../gyms-repository";

export class InMemoryGymsRepository implements GymsRepository {
  public inMemoryRegisters: Gym[] = [];
  async findById(id: string) {
    const user = this.inMemoryRegisters.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    return user;
  }
}
