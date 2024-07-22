import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { q, page } = searchQuerySchema.parse(request.query);

  const searchGymUseCase = makeSearchGymsUseCase();

  const searchGymResponse = await searchGymUseCase.exec({ query: q, page });

  return reply.status(201).send(searchGymResponse);
}
