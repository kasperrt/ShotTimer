import { Blinker } from '@/components/Blinker';
import { Drawing } from '@/components/Drawing';
import { Input } from '@/components/Input';
import { Join } from '@/components/Join';
import { Scoreboard } from '@/components/Scoreboard';
import { Timer } from '@/components/Timer';
import { socket } from '@/network/socket';
import { useModals } from '@/router';
import { useGame } from '@/stores/game';

export default function Landing() {
  const modals = useModals();
  const { gameId, setGameId, countdown, drinker, players, addPlayer, removePlayer } = useGame();

  socket({ addPlayer, setGameId });

  return (
    <>
      <Blinker drinker={drinker} />
      <div class="relative h-full">
        <div class="absolute z-30 flex w-full items-center justify-between p-2">
          <button type="button" onClick={() => modals.open('/settings')}>
            Settings
          </button>
          <button type="button" onClick={() => modals.open('/rules')}>
            Rules
          </button>
        </div>
        <div class="relative z-20 flex h-full flex-col justify-center gap-y-4">
          <Timer drinker={drinker} countdown={countdown} />
          <Input addPlayer={addPlayer} />
          <Join gameId={gameId} />
          <Scoreboard players={players} removePlayer={removePlayer} />
        </div>
        <Drawing drinker={drinker} />
        <a href="https://github.com/kasperrt/shottimer" class="absolute bottom-2 right-2 z-20 m-auto w-full text-right">
          GitHub
        </a>
      </div>
    </>
  );
}
