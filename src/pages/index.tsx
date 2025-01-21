import { Blinker } from '@/components/Blinker';
import { Input } from '@/components/Input';
import { Join } from '@/components/Join';
import { Scoreboard } from '@/components/Scoreboard';
import { Timer } from '@/components/Timer';
import { useNetwork } from '@/hooks/useNetwork';
import { useModals } from '@/router';

export default function Landing() {
  const modals = useModals();
  useNetwork();

  return (
    <>
      <Blinker />
      <div class="relative h-full">
        <div class="absolute flex w-full items-center justify-between p-2">
          <button type="button" onClick={() => modals.open('/settings')}>
            Settings
          </button>
          <button type="button" onClick={() => modals.open('/rules')}>
            Rules
          </button>
        </div>
        <div class="flex h-full flex-col justify-center gap-y-4">
          <Timer />
          <Input />
          <Join />
          <Scoreboard />
        </div>
        <a href="https://github.com/kasperrt/shottimer" class="absolute bottom-2 right-2 m-auto w-full text-right">
          GitHub
        </a>
      </div>
    </>
  );
}
