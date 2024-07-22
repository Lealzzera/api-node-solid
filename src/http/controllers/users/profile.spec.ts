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
    const authResponse = await request(app.server)
      .post("/sessions")
      .send({ email: "john@acme.com", password: "test1234" });

    const { token } = authResponse.body;

    const profileResponse = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(profileResponse.status).toEqual(200);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({ email: "john@acme.com" })
    );
  });
});
