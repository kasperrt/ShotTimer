import { RequestClient, type RequestDefinitions } from 'wiretyped';
import { z } from 'zod';
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
      events: {
        join: z.object({ id: z.string() }),
        player: playerSchema,
      },
    },
  },
} satisfies RequestDefinitions;

export const httpClient = new RequestClient({
  endpoints,
  baseUrl: import.meta.env.VITE_HOST,
  hostname: import.meta.env.VITE_HOST,
  debug: true,
});
