import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { Role, User } from "@prisma/client";

interface RegisterUseCaseInterface {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async exec({
    name,
    email,
    password,
    role,
  }: RegisterUseCaseInterface): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 3);

    const userEmailAlreadyExists =
      await this.usersRepository.findByEmail(email);

    if (userEmailAlreadyExists) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      role: role ? role : "MEMBER",
    });
    return { user };
  }
}
