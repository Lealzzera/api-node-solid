import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server)
    .post("/users")
    .send({ name: "John Doe", email: "john@acme.com", password: "test1234" });
  const authResponse = await request(app.server)
    .post("/sessions")
    .send({ email: "john@acme.com", password: "test1234" });

  const { token } = authResponse.body;

  return { token };
}
