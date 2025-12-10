import qrcode from 'qrcode';
import { createEffect, createSignal, Show } from 'solid-js';
import type { Game } from '@/stores/game';

interface Props {
  gameId: Game['gameId'];
}

export function Join({ gameId }: Props) {
  const [code, setCode] = createSignal<string>('');
  const joinUrl = () => `${window.location.protocol}//${window.location.host}/${gameId()}`;

  createEffect(async () => {
    const c = await qrcode.toDataURL(joinUrl());
    setCode(c);
  });

  return (
    <div class="h-40">
      <Show when={gameId()}>
        <div class="flex w-full flex-col items-center justify-center">
          <div class="text-center">
            Join{' '}
            <a href={joinUrl()} target="_blank" rel="noreferrer">
              {joinUrl()}
            </a>
          </div>
          <div class="size-28">
            <img src={code()} alt={`Join ${joinUrl()}`} class="size-28" />
          </div>
        </div>
      </Show>
    </div>
  );
}
