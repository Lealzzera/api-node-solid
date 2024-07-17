import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { it, beforeEach, describe, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;
describe("Validate check-in use case tests", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);
  });

  it("should be able to validate a check-in", async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.exec({ checkInId: createdCheckIn.id });

    expect(checkIn).toEqual(
      expect.objectContaining({ validated_at: expect.any(Date) })
    );
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should not be able to validate an inexistent check-in", async () => {
    await expect(() =>
      sut.exec({ checkInId: "inexistent-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
