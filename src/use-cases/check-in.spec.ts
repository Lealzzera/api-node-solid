import { expect, it, describe, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case Tests", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("It should be able to check in", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 37, 15));

    const { checkIn } = await sut.exec({
      gymId: "gym-01",
      userId: "user-01",
    });

    console.log(checkIn.created_at);

    expect(checkIn?.id).toEqual(expect.any(String));
  });

  it("It should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 37, 15));

    await sut.exec({
      gymId: "gym-01",
      userId: "user-01",
    });

    await expect(() =>
      sut.exec({
        gymId: "gym-01",
        userId: "user-01",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("It should  be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 37, 15));

    await sut.exec({
      gymId: "gym-01",
      userId: "user-01",
    });

    vi.setSystemTime(new Date(2023, 0, 21, 8, 37, 15));

    const { checkIn } = await sut.exec({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
