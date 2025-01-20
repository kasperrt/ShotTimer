import { useModals } from '@/router';
import type { JSX } from 'solid-js';

interface Props {
  children?: JSX.Element;
}

export function Modal({ children }: Props) {
  const modals = useModals();

  const close = modals.close;

  return (
    <>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: On purpose for only clicks */}
      <div class="absolute inset-0 z-10 h-full w-full bg-black/40" onClick={() => modals.close()} />
      <div class="absolute inset-0 z-20 m-auto h-fit w-full max-w-xl bg-white p-8">
        <button type="button" onClick={() => close()} class="absolute right-5 top-5">
          X
        </button>
        {children}
      </div>
    </>
  );
}
