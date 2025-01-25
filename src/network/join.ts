import type { Player } from '@/types/types';

export async function join(id: string, name: string, drawing: Player['drawing']) {
  return fetch(`${import.meta.env.VITE_HOST ?? ''}/join/${id}`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      drawing,
    }),
  })
    .then((res) => {
      if (!res.ok || res.status !== 204) {
        throw new Error('Not ok');
      }
      return true;
    })
    .catch(() => false);
}
