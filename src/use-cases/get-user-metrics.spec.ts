import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case Tests", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("It should be able to get check-ins count from metrics", async () => {
    const userId = "user-01";
    await checkInsRepository.create({ gym_id: "gym-01", user_id: userId });
    await checkInsRepository.create({ gym_id: "gym-01", user_id: userId });

    const { checkInsCount } = await sut.exec({ userId: userId });

    expect(checkInsCount).toBeGreaterThanOrEqual(1);
  });
});
