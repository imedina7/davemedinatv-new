export function formatDuration(ms: number): string {
  const date = new Date(ms);
  const hours = date.getHours() - 21;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const format = `${hours > 0 ? hours + ":" : ""}${minutes}:${seconds}`;
  return format;
}
