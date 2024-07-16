import { ChekcInsRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricsUseCaseRequestInterface {
  userId: string;
}

interface GetUserMetricsUseCaseResponseInterface {
  checkInsCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: ChekcInsRepository) {}

  async exec({
    userId,
  }: GetUserMetricsUseCaseRequestInterface): Promise<GetUserMetricsUseCaseResponseInterface> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);
    return { checkInsCount };
  }
}
