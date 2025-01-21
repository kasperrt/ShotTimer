import { game } from '@/stores/game';
import { settings } from '@/stores/settings';
import { For, Show } from 'solid-js';

export function Scoreboard() {
  const { players, removePlayer } = game;
  const { scoreEnabled } = settings;

  const onKeyDown = (e: KeyboardEvent, id: string) => {
    if (e.code !== 'Enter' && e.code !== 'Space') {
      return;
    }

    removePlayer(id);
  };

  return (
    <Show when={scoreEnabled() && players.length > 0}>
      <div class="left-20 top-20 w-full px-8 lg:absolute lg:max-w-48 lg:px-0">
        <h2>Score</h2>
        <hr />
        <ul>
          <For each={players}>
            {(player) => (
              <li
                class="flex w-full cursor-pointer items-center justify-between"
                onClick={() => removePlayer(player.id)}
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
