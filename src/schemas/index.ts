import z from 'zod';

export const simplePlayerSchema = z.object({
  name: z.string(),
  drawing: z.object({
    x: z.array(z.number()),
    y: z.array(z.number()),
    drag: z.array(z.boolean()),
    color: z.string(),
    height: z.number(),
    width: z.number(),
  }),
});
