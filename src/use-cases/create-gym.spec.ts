import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;
describe("Create gym use case tests", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });
  it("it should be able to create a new gym", async () => {
    const { gym } = await sut.exec({
      title: "JavaScript Gym",
      latitude: -27.2092052,
      longitude: -49.6401091,
      description: null,
      phone: null,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
