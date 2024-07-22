import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyParamsSchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyParamsSchema.parse(request.query);

  const nearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const nearbyGymResponse = await nearbyGymsUseCase.exec({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send(nearbyGymResponse);
}
