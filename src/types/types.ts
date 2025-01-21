import { z } from 'zod';

export const playerSchema = z.object({
  id: z.string(),
  name: z.string(),
  drawing: z
    .object({
      x: z.array(z.number()),
      y: z.array(z.number()),
      drag: z.array(z.boolean()),
      color: z.string(),
    })
    .optional(),
  score: z.number(),
  joined: z.number(),
});

export const drawnPlayerSchema = playerSchema.extend({
  drawn: z.number(),
});

export type Player = z.infer<typeof playerSchema>;
export type DrawnPlayer = z.infer<typeof drawnPlayerSchema>;

export type Game = {
  players: Record<string, Player>;
  addPlayer: (p: Player) => void;
  removePlayer: (id: string) => void;
  incrementScore: (id: string) => void;
};

export type GameType = 'ANARCHY' | 'FAIR';

export type Timeout = ReturnType<typeof setTimeout> | null;
export type Interval = ReturnType<typeof setInterval> | null;
