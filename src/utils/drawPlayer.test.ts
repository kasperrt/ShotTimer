import type { Player } from '@/types/types';
import { expect, test } from 'vitest';
import { drawPlayer } from './drawPlayer';

function incrementScore(id: string, players: Player[]) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id !== id) {
      continue;
    }

    players[i].score++;
  }
}

test('drawPlayer: FAIR-mode never more than 3 ahead', () => {
  const players: Player[] = [
    { id: '1', joined: new Date().getTime(), name: '1', score: 0 },
    { id: '2', joined: new Date().getTime(), name: '2', score: 0 },
    { id: '3', joined: new Date().getTime(), name: '3', score: 0 },
  ];

  for (let i = 0; i < 100000; i++) {
    const winner = drawPlayer(players, 'FAIR');
    incrementScore(winner.id, players);
  }

  const scores = players.map((player) => player.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);

  expect(max - min).toBeLessThan(4);
});
