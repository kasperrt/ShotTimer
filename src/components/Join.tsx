import { game } from '@/stores/game';
import qrcode from 'qrcode';
import { Show, createEffect, createSignal } from 'solid-js';

export function Join() {
  const { gameId } = game;
  const [code, setCode] = createSignal<string>('');

  createEffect(async () => {
    const c = await qrcode.toDataURL(`${window.location.protocol}//${window.location.host}/${gameId()}`);
    setCode(c);
  });

  return (
    <Show when={gameId()}>
      <div class="flex w-full flex-col items-center justify-center">
        <div class="text-center">Join {`${window.location.protocol}//${window.location.host}/${gameId()}`}</div>
        <img
          src={code()}
          alt={`Join ${window.location.protocol}//${window.location.host}/${gameId()}`}
          class="size-28"
        />
      </div>
    </Show>
  );
}
