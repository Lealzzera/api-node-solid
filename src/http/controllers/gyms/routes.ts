import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { create } from "./create";
import { search } from "./search";
import { nearby } from "./nearby";
import { verifyUserRole } from "@/http/middlewares/only-admin";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);
  app.post("/gyms", { onRequest: [verifyUserRole("ADMIN")] }, create);
  app.get("/gyms/search", search);
  app.get("/gyms/nearby", nearby);
}
