import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const userMetricsUseCase = makeGetUserMetricsUseCase();

  const { checkInsCount } = await userMetricsUseCase.exec({
    userId: request.user.sub,
  });

  return reply.status(201).send({ checkInsCount });
}