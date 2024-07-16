import { UsersRepository } from "@/repositories/users-repository";
import { CheckIn, User } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { ChekcInsRepository } from "@/repositories/check-ins-repository";

interface CheckInUseCaseRequestInterface {
  userId: string;
  gymId: string;
}

interface CheckInUseCaseResponseInterface {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(private checkInsRepository: ChekcInsRepository) {}

  async exec({
    userId,
    gymId,
  }: CheckInUseCaseRequestInterface): Promise<CheckInUseCaseResponseInterface> {
    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDay) {
      throw new Error();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkIn,
    };
  }
}
