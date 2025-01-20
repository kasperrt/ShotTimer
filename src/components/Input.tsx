import { game } from '@/stores/game';
import { createSignal, createUniqueId } from 'solid-js';

export function Input() {
  const { addPlayer } = game;
  const [name, setName] = createSignal('');

  const onSubmit = (e: Event) => {
    e.preventDefault();
    addPlayer({
      name: name(),
      id: createUniqueId(),
      joined: new Date(),
      score: 0,
    });
    setName('');
  };

  const onChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setName(target.value);
  };

  return (
    <form onSubmit={onSubmit} class="text-center">
      <input
        name="Name"
        onChange={onChange}
        value={name()}
        placeholder="Type player name here..."
        class="m-auto w-5/6 max-w-4xl border-b border-b-black/20 bg-transparent pb-2 text-center text-3xl font-thin outline-none"
      />
    </form>
  );
}
