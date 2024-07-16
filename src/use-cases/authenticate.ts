import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface AuthenticateUseCaseRequestInterface {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponseInterface {
  user: User | null;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async exec({
    email,
    password,
  }: AuthenticateUseCaseRequestInterface): Promise<AuthenticateUseCaseResponseInterface> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
