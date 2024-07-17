import { Prisma, CheckIn } from "@prisma/client";
import { ChekcInsRepository } from "../check-ins-repository";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements ChekcInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    return await prisma.checkIn.create({
      data,
    });
  }
  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");
    const checkInOnSameDate = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    });

    return checkInOnSameDate;
  }
  async findManyByUserId(userId: string, page: number) {
    return await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });
  }
  async findById(checkInId: string) {
    return await prisma.checkIn.findUnique({
      where: {
        id: checkInId,
      },
    });
  }
  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        id: userId,
      },
    });
    return count;
  }
  async save(checkIn: CheckIn) {
    const checkInUpdated = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    });
    return checkInUpdated;
  }
}
