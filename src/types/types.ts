import { z } from 'zod';

export const playerSchema = z.object({
  id: z.string(),
  name: z.string(),
  drawing: z.array(z.number()),
  score: z.number(),
  joined: z.date(),
});

export type Player = z.infer<typeof playerSchema>;

export type Game = {
  players: Record<string, Player>;
  addPlayer: (p: Player) => void;
  removePlayer: (id: string) => void;
  incrementScore: (id: string) => void;
};

export type GameType = 'ANARCHY' | 'FAIR';

export type Timeout = ReturnType<typeof setTimeout> | null;
export type Interval = ReturnType<typeof setInterval> | null;
