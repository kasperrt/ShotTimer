export type Player = {
  id: string;
  name: string;
  // drawing: any, // update when I remember how canvas' works,
  score: number;
  joined: Date;
};

export type Game = {
  players: Player[];
  addPlayer: (p: Player) => void;
};

export type GameType = 'ANARCHY' | 'FAIR';

export type Settings = {
  soundEnabled: boolean;
  scoreEnabled: boolean;
  timerEnabled: boolean;
  rigidInterval: null | number;
  gameType: GameType;
  enableSound: (enabled: boolean) => void;
  enableScore: (enabled: boolean) => void;
  showTimer: (show: boolean) => void;
  toggleInterval: (i: null | number) => void;
  setGameType: (type: GameType) => void;
};
