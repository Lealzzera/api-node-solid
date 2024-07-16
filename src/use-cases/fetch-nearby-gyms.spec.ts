import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";
import { Decimal } from "@prisma/client/runtime/library";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;
describe("Fetch nearby gyms use case tests", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });
  it("it should be able to fetch nearby gyms by user latitude and logitude", async () => {
    await gymsRepository.create({
      title: "Javascript so far gym",
      description: null,
      phone: null,
      latitude: -23.5629637,
      longitude: -46.8155989,
    });

    await gymsRepository.create({
      title: "Javascript so close gym",
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    const { gyms } = await sut.exec({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Javascript so close gym" }),
    ]);
  });
});
