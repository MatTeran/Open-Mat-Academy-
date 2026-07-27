/**
 * Lightweight formatting helpers for UI presentation.
 */

export function formatBeltLabel(belt: string, stripes: number): string {
  const capitalized = belt.charAt(0).toUpperCase() + belt.slice(1);
  if (stripes <= 0) {
    return `${capitalized} Belt`;
  }
  return `${capitalized} Belt · ${stripes} stripe${stripes === 1 ? '' : 's'}`;
}

export function formatClassTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
