import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Authenticate e2e test", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("It should be able to authenticate", async () => {
    await request(app.server)
      .post("/users")
      .send({ name: "John Doe", email: "john@acme.com", password: "test1234" });
    const response = await request(app.server)
      .post("/sessions")
      .send({ email: "john@acme.com", password: "test1234" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ token: expect.any(String) });
  });
});
