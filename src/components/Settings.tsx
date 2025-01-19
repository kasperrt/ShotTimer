import { useSettings } from '@/hooks/useSettings';

export function Settings() {
  const { soundEnabled, scoreEnabled, gameType, timerEnabled, enableScore, enableSound, setGameType, showTimer } =
    useSettings();

  return (
    <div>
      <label>
        Sound
        <input checked={soundEnabled} onChange={() => enableSound(!soundEnabled)} />
      </label>
      <label>
        Score
        <input checked={scoreEnabled} onChange={() => enableScore(!scoreEnabled)} />
      </label>
      <label>
        Type
        <input checked={gameType === 'FAIR'} onChange={() => setGameType(gameType === 'FAIR' ? 'ANARCHY' : 'FAIR')} />
      </label>
      <label>
        Timer
        <input checked={timerEnabled} onChange={() => showTimer(!timerEnabled)} />
      </label>
    </div>
  );
}
