import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { randomUUID } from "node:crypto";
import { Decimal } from "@prisma/client/runtime/library";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
  public inMemoryRegisters: Gym[] = [];
  async findById(id: string) {
    const gym = this.inMemoryRegisters.find((item) => item.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
      checkIns: [],
    };

    this.inMemoryRegisters.push(gym);

    return gym;
  }

  async findManyByQuery(query: string, page: number) {
    const gyms = this.inMemoryRegisters
      .filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase().trim())
      )
      .slice((page - 1) * 20, page * 20);
    return gyms;
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.inMemoryRegisters.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        }
      );

      return distance < 10;
    });
  }
}
