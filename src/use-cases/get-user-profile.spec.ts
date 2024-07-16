import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-respository";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Authenticate Use Case Tests", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("It should be able to get an user profile by id", async () => {
    const userCreated = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@acme.com",
      password_hash: await hash("1234567", 3),
    });

    const { user } = await sut.exec({ id: userCreated.id });

    expect(user.name).toEqual("John Doe");
  });

  it("It should not be able to get an user profile with a wrong id", async () => {
    await expect(() =>
      sut.exec({ id: "no-valid-or-existent-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
