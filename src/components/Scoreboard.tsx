import { For, Show } from 'solid-js';
import type { Game } from '@/stores/game';
import { settings } from '@/stores/settings';

interface Props {
  players: Game['players'];
  removePlayer: Game['removePlayer'];
}

export function Scoreboard({ players, removePlayer }: Props) {
  const { scoreEnabled } = settings;

  const onKeyDown = (e: KeyboardEvent, id: string) => {
    if (e.code !== 'Enter' && e.code !== 'Space') {
      return;
    }

    removePlayer(id);
  };

  return (
    <Show when={scoreEnabled() && players.length > 0}>
      <div class="top-20 left-20 w-full px-8 lg:absolute lg:max-w-48 lg:px-0">
        <h2>Score</h2>
        <hr />
        <ul>
          <For each={players}>
            {(player) => (
              <li
                class="flex w-full cursor-pointer items-center justify-between"
                on:click={() => removePlayer(player.id)}
                onKeyDown={(e) => onKeyDown(e, player.id)}
              >
                <span>{player.name}</span>
                <span>{player.score}</span>
              </li>
            )}
          </For>
        </ul>
      </div>
    </Show>
  );
}
