import "@fastify/jwt";
import { number, string } from "zod";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: string;
    };
  }
}
