import { CheckIn } from "@prisma/client";
import { ChekcInsRepository } from "@/repositories/check-ins-repository";

interface FetchUserCheckInsHistoryUseCaseRequestInterface {
  userId: string;
  page: number;
}

interface FetchUserCheckInsHistoryUseCaseResponseInterface {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: ChekcInsRepository) {}

  async exec({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequestInterface): Promise<FetchUserCheckInsHistoryUseCaseResponseInterface> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    return { checkIns };
  }
}
