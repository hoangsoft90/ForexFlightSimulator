/**
 * Format a price to 1 decimal place (XAUUSD convention).
 */
export function formatPrice(price: number): string {
  return price.toFixed(1);
}

/**
 * Format pips for display. XAUUSD: 1 pip = $0.10.
 * Input is raw dollar distance; output is pip integer.
 */
export function formatPips(pips: number): string {
  const pipValue = Math.round(pips * 10);
  return pipValue >= 0 ? `+${pipValue}` : `${pipValue}`;
}

/**
 * Format timestamp to HH:MM UTC.
 */
export function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

/**
 * Format timestamp to a readable date + time.
 */
export function formatDateTime(ts: number): string {
  const d = new Date(ts);
  const date = d.toISOString().split('T')[0];
  return `${date} ${formatTime(ts)}`;
}

/**
 * Get a score color based on value (semantic: green good, amber medium, red low).
 */
export function scoreColor(score: number): string {
  if (score >= 70) return '#16A34A'; // green
  if (score >= 40) return '#D97706'; // amber
  return '#DC2626'; // red
}

/**
 * Get a score label for display.
 */
export function scoreLabel(score: number): string {
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Weak';
}
