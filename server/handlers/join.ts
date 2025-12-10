import type { Context } from 'hono';
import { nanoid } from 'nanoid';
import { simplePlayerSchema } from '../../src/schemas';
import type { Player } from '../../src/types/types';
import { getSocket } from './socket';

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
    joined: Date.now(),
    score: 0,
  };

  getSocket().to(id).emit('join', JSON.stringify(player));

  return new Response(null, { status: 204 });
}
