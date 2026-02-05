import type { Context } from 'hono';
import { nanoid } from 'nanoid';
import { type Player, simplePlayerSchema } from '../../src/types/types.js';
import { sendPlayerEvent } from './sse.js';

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

  const emitted = await sendPlayerEvent(id, JSON.stringify(player));
  if (!emitted) {
    console.warn(`could not find an active game for id ${id}`);
    return new Response(null, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
