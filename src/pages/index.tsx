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
  const { gameId, setGameId, countdown, winner, players, addPlayer, removePlayer } = useGame();

  socket({ addPlayer, setGameId });

  return (
    <>
      <Blinker winner={winner} />
      <div class="relative h-full">
        <div class="absolute z-30 flex w-full items-center justify-between p-2">
          <button type="button" onClick={() => modals.open('/settings')} class="cursor-pointer">
            Settings
          </button>
          <button type="button" onClick={() => modals.open('/rules')} class="cursor-pointer">
            Rules
          </button>
        </div>
        <div class="relative z-20 flex h-full flex-col justify-center gap-y-4">
          <Timer winner={winner} countdown={countdown} />
          <Input addPlayer={addPlayer} />
          <Join gameId={gameId} />
          <Scoreboard players={players} removePlayer={removePlayer} />
        </div>
        <Drawing winner={winner} />
        <a href="https://github.com/kasperrt/shottimer" class="absolute right-2 bottom-2 z-20 m-auto w-full text-right">
          GitHub
        </a>
      </div>
    </>
  );
}
