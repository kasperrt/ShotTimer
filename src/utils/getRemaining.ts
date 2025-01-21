export function getRemaining(remaining: number | null) {
  if (!remaining) {
    return {
      minutes: '00',
      seconds: '00',
      milliseconds: '000',
    };
  }
  const seconds = Math.floor(remaining / 1000) - Math.floor(remaining / 1000 / 60) * 60;
  const minutes = Math.floor(remaining / 1000 / 60);
  const milliseconds = remaining - seconds * 1000 - minutes * 60 * 1000;

  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    milliseconds: milliseconds.toString().padStart(3, '0'),
  };
}
