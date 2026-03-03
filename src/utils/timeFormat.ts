export const formatTime = (seconds: number) => {
  const pad = (num: number, size = 2) => num.toString().padStart(size, '0');
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${pad(m)}:${pad(s)}:${pad(ms)}`;
};
