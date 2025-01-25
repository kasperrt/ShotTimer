export function getRemainingTimeReadable(remainingTimeReadable: number | null) {
  if (!remainingTimeReadable) {
    return {
      minutes: '00',
      seconds: '00',
      milliseconds: '000',
    };
  }
  const seconds = Math.floor(remainingTimeReadable / 1000) - Math.floor(remainingTimeReadable / 1000 / 60) * 60;
  const minutes = Math.floor(remainingTimeReadable / 1000 / 60);
  const milliseconds = remainingTimeReadable - seconds * 1000 - minutes * 60 * 1000;

  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    milliseconds: milliseconds.toString().padStart(3, '0'),
  };
}
