import type { Context } from 'hono';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type { Player } from '../../src/types/types';
import { getSocket } from './socket';

const simplePlayerSchema = z.object({
  name: z.string(),
  drawing: z.array(z.number()),
});

export async function joinHandler(ctx: Context) {
  const id = ctx.req.param('id');
  const body = await ctx.req.json();
  const { data, success, error } = await simplePlayerSchema.safeParseAsync(body);

  if (!success || error) {
    console.error('error could not parse data:', error);
    return ctx.status(500);
  }

  const player: Player = {
    id: nanoid(),
    name: data.name,
    drawing: data.drawing,
    joined: new Date(),
    score: 0,
  };

  getSocket().to(id).emit(JSON.stringify(player));
}
