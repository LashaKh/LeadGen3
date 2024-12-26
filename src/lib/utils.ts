export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function isInRange(value: number, start: number, end: number) {
  const min = Math.min(start, end);
  const max = Math.max(start, end);
  return value >= min && value <= max;
}