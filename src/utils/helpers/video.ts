export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = (ms / 1000) % 60;
  return `${minutes}:${seconds}`;
}
