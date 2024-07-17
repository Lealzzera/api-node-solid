import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateGymUseCase } from "../create-gym";

export function makeCreateGymUseCase() {
  const createGymRepository = new PrismaGymsRepository();
  const createGymUseCase = new CreateGymUseCase(createGymRepository);
  return createGymUseCase;
}
