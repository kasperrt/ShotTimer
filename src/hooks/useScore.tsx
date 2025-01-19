import type { Game, Player } from '@/types/types';
import { create } from 'zustand';

export const useScore = create<Game>((set) => ({
  players: [],
  incrementScore: (p: Player) =>
    set((prev) => {
      const index = prev.players.findIndex((i) => i.id === p.id);
      if (!index) {
        return prev;
      }
      prev.players[index].score += 1;
      return prev;
    }),
  removePlayer: (p: Player) =>
    set((prev) => ({
      ...prev,
      players: [...prev.players.filter((player) => player.id !== p.id)],
    })),
  addPlayer: (p: Player) =>
    set((prev) => ({
      ...prev,
      players: [...prev.players, p],
    })),
}));
