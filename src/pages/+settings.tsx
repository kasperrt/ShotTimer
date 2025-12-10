import { Modal } from '@/components/Modal';
import { Toggle } from '@/components/Toggle';
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
      <div class="flex flex-col gap-y-8">
        <h1 class="w-full text-center text-3xl">Settings</h1>
        <Toggle label="Sound" checked={soundEnabled()} onChange={() => setSoundEnabled(!soundEnabled())} />
        <Toggle label="Score" checked={scoreEnabled()} onChange={() => setScoreEnabled(!scoreEnabled())} />
        <Toggle label="Blinking" checked={blinkingEnabled()} onChange={() => setBlinkingEnabled(!blinkingEnabled())} />
        <Toggle label="Timer" checked={timerEnabled()} onChange={() => setTimerEnabled(!timerEnabled())} />
        <Toggle
          label="Type"
          text={gameType()}
          checked={gameType() === 'FAIR'}
          onChange={() => setGameType(gameType() === 'FAIR' ? 'ANARCHY' : 'FAIR')}
        />
        <label class="flex w-full cursor-pointer justify-between">
          Intervals (minutes)
          <input
            type="number"
            onKeyUp={onChangeIntervals}
            value={intervals() ?? ''}
            placeholder="Random (1-6)"
            class="border-b border-b-black/20 pb-2 text-right outline-hidden"
          />
        </label>
      </div>
    </Modal>
  );
}
