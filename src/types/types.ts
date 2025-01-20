export type Player = {
  id: string;
  name: string;
  // drawing: any, // update when I remember how canvas' works,
  score: number;
  joined: Date;
};

export type Game = {
  players: Record<string, Player>;
  addPlayer: (p: Player) => void;
  removePlayer: (id: string) => void;
  incrementScore: (id: string) => void;
};

export type GameType = 'ANARCHY' | 'FAIR';

export type Timeout = ReturnType<typeof setTimeout> | null;
export type Interval = ReturnType<typeof setInterval> | null;
