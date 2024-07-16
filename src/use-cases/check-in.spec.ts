import { expect, it, describe, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case Tests", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "JavaScript gym",
      description: "",
      phone: "",
      latitude: 0,
      longitude: 0,
      created_at: new Date(),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("It should be able to check in", async () => {
    const { checkIn } = await sut.exec({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn?.id).toEqual(expect.any(String));
  });

  it("It should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 37, 15));

    await sut.exec({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.exec({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(MaxDistanceOfCheckInsError);
  });

  it("It should  be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 37, 15));

    await sut.exec({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2023, 0, 21, 8, 37, 15));

    const { checkIn } = await sut.exec({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("It should not be able to check in on distant gym", async () => {
    gymsRepository.inMemoryRegisters.push({
      id: "gym-02",
      title: "JavaScript gym",
      description: "",
      phone: "",
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
      created_at: new Date(),
    });

    await expect(() =>
      sut.exec({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
