import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;
describe("Search gyms use case tests", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });
  it("it should be able to search gyms by query", async () => {
    for (let i = 1; i <= 45; i++) {
      if (i % 2 === 0) {
        gymsRepository.create({
          latitude: 0,
          longitude: 0,
          title: `Javascript gym - ${i}`,
          phone: null,
          description: null,
        });
      } else {
        gymsRepository.create({
          latitude: 0,
          longitude: 0,
          title: `Typescript gym - ${i}`,
          phone: null,
          description: null,
        });
      }
    }

    const { gyms } = await sut.exec({ query: "Typescript", page: 1 });
    expect(gyms.length).toEqual(20);
  });
});
