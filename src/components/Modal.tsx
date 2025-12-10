import type { JSX } from 'solid-js';
import { useModals } from '@/router';

interface Props {
  children?: JSX.Element;
}

export function Modal({ children }: Props) {
  const modals = useModals();

  const onClose = () => modals.close();

  return (
    <>
      <button
        type="button"
        aria-label="Close modal"
        class="absolute inset-0 z-20 h-full w-full bg-black/40"
        on:click={onClose}
      />
      <div class="absolute top-0 right-0 left-0 z-30 m-auto h-fit min-h-screen w-full max-w-xl min-w-full rounded-none bg-white p-8 lg:bottom-0 lg:min-h-[unset] lg:min-w-[unset] lg:rounded-xl">
        <button type="button" on:click={onClose} class="absolute top-5 right-5 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
              fill="#0F1729"
            />
          </svg>
        </button>
        {children}
      </div>
    </>
  );
}
