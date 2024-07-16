import { expect, it, describe, beforeEach } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-respository";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case Tests", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("It should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@acme.com",
      password_hash: await hash("1234567", 3),
    });

    const { user } = await sut.exec({
      email: "johndoe@acme.com",
      password: "1234567",
    });

    expect(user?.id).toEqual(expect.any(String));
  });

  it("It should not be able to authenticate with wrong e-mail", async () => {
    await expect(() =>
      sut.exec({
        email: "johndoe@example.com",
        password: "1234567",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("It should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@acme.com",
      password_hash: await hash("1234567", 3),
    });

    await expect(() =>
      sut.exec({
        email: "johndoe@acme.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
