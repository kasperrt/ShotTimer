import { Modal } from '@/components/Modal';
import { settings } from '@/stores/settings';

export default function SettingsModal() {
  const {
    soundEnabled,
    scoreEnabled,
    intervals,
    gameType,
    timerEnabled,
    blinkingEnabled,
    setSoundEnabled,
    setScoreEnabled,
    setGameType,
    setIntervals,
    setTimerEnabled,
    setBlinkingEnabled,
  } = settings;

  const onChangeIntervals = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const interval = Number.parseInt(target.value);
    if (Number.isNaN(interval)) {
      setIntervals(null);
      return;
    }

    setIntervals(interval);
  };

  return (
    <Modal>
      <div class="flex flex-col gap-y-4">
        <h1 class="w-full text-center text-3xl">Settings</h1>
        <label class="flex w-full cursor-pointer justify-between">
          Sound
          <input type="checkbox" checked={soundEnabled()} onChange={() => setSoundEnabled(!soundEnabled())} />
        </label>
        <label class="flex w-full cursor-pointer justify-between">
          Score
          <input type="checkbox" checked={scoreEnabled()} onChange={() => setScoreEnabled(!scoreEnabled())} />
        </label>
        <label class="flex w-full cursor-pointer justify-between">
          Type{' '}
          <span>
            {gameType()}
            <input
              type="checkbox"
              class="absolute -left-full -top-full"
              checked={gameType() === 'FAIR'}
              onChange={() => setGameType(gameType() === 'FAIR' ? 'ANARCHY' : 'FAIR')}
            />
          </span>
        </label>
        <label class="flex w-full cursor-pointer justify-between">
          Blinking
          <input type="checkbox" checked={blinkingEnabled()} onChange={() => setBlinkingEnabled(!blinkingEnabled())} />
        </label>
        <label class="flex w-full cursor-pointer justify-between">
          Timer
          <input type="checkbox" checked={timerEnabled()} onChange={() => setTimerEnabled(!timerEnabled())} />
        </label>
        <label class="flex w-full cursor-pointer justify-between">
          Intervals (minutes)
          <input
            type="number"
            onKeyUp={onChangeIntervals}
            value={intervals() ?? ''}
            placeholder="Random (1-6)"
            class="border-b border-b-black/20 pb-2 text-right outline-none"
          />
        </label>
      </div>
    </Modal>
  );
}
