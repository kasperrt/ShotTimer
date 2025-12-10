import { RequestClient, type RequestDefinitions } from 'wiretyped';
import z from 'zod';
import { simplePlayerSchema } from '@/schemas';

const endpoints = {
  '/join/{id}': {
    post: {
      response: z.null(),
      request: simplePlayerSchema,
    },
  },
} satisfies RequestDefinitions;

export const httpClient = new RequestClient({
  endpoints,
  baseUrl: import.meta.env.VITE_HOST,
  hostname: import.meta.env.VITE_HOST,
  debug: true,
});
