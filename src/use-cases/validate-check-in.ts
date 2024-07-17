import { CheckIn } from "@prisma/client";
import { ChekcInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

interface ValidateCheckInUseCaseRequestInterface {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponseInterface {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: ChekcInsRepository) {}

  async exec({
    checkInId,
  }: ValidateCheckInUseCaseRequestInterface): Promise<ValidateCheckInUseCaseResponseInterface> {
    const checkIn = await this.checkInsRepository.findById(checkInId);
    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesBetweenCheckinCreationAndValidation = dayjs(
      new Date()
    ).diff(checkIn.created_at, "minutes");

    if (distanceInMinutesBetweenCheckinCreationAndValidation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
