import type { Context } from 'hono';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type { Player } from '../../src/types/types';
import { getSocket } from './socket';

const simplePlayerSchema = z.object({
  name: z.string(),
  drawing: z.object({
    x: z.array(z.number()),
    y: z.array(z.number()),
    drag: z.array(z.boolean()),
    color: z.string(),
  }),
});

export async function joinHandler(ctx: Context) {
  const id = ctx.req.param('id');
  const body = await ctx.req.json();
  const { data, success, error } = simplePlayerSchema.safeParse(body);

  if (!success || error) {
    console.error('error could not parse data:', error);
    return new Response(null, { status: 500 });
  }

  const player: Player = {
    id: nanoid(),
    name: data.name,
    drawing: data.drawing,
    joined: new Date().getTime(),
    score: 0,
  };

  getSocket().to(id).emit('join', JSON.stringify(player));

  return new Response(null, { status: 204 });
}
