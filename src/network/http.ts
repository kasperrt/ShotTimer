import { RequestClient, type RequestDefinitions } from 'wiretyped';
import z from 'zod';
import { playerSchema, simplePlayerSchema } from '@/types/types';

const endpoints = {
  '/join/{id}': {
    post: {
      response: z.null(),
      request: simplePlayerSchema,
    },
  },
  '/rtd': {
    sse: {
      response: z.discriminatedUnion('type', [
        z.object({
          type: z.literal('join'),
          id: z.string(),
        }),
        z.object({
          type: z.literal('player'),
          player: playerSchema,
        }),
      ]),
    },
  },
} satisfies RequestDefinitions;

export const httpClient = new RequestClient({
  endpoints,
  baseUrl: import.meta.env.VITE_HOST,
  hostname: import.meta.env.VITE_HOST,
  debug: true,
});
