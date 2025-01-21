import type { DrawnPlayer, GameType, Player } from '@/types/types';

export function drawPlayer(players: Player[], gameType: GameType): DrawnPlayer {
  let maxScore: number = players[0].score;
  let minScore: number = players[0].score;

  for (const player of players) {
    if (player.score > maxScore) {
      maxScore = player.score;
    }

    if (player.score < minScore) {
      minScore = player.score;
    }
  }

  const maxDiff = maxScore - minScore;
  const pool: Player[] = players.reduce<Player[]>((prev, current) => {
    if (gameType === 'ANARCHY') {
      prev.push(current);
      return prev;
    }

    let occurrences = maxScore - current.score;
    if (maxDiff <= 3) {
      occurrences = 3 - (current.score % 3);
    }

    for (let i = 0; i < occurrences; i++) {
      prev.push(current);
    }

    return prev;
  }, []);

  return {
    ...pool[Math.floor(Math.random() * pool.length)],
    drawn: new Date().getTime(),
  };
}
