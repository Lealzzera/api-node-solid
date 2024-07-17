import { CheckIn } from "@prisma/client";
import { ChekcInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

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

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
