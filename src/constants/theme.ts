// Design tokens per design.md §0
// Flat, no gradients, no decorative shadows.
// Semantic color: green=good, red=loss/error, amber=root cause, neutral=state

export const colors = {
  // Semantic
  green: '#16A34A',
  greenLight: '#DCFCE7',
  red: '#DC2626',
  redLight: '#FEE2E2',
  amber: '#D97706',
  amberLight: '#FEF3C7',
  blue: '#2563EB',     // level / entry
  blueLight: '#DBEAFE',

  // Neutral palette
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#EFF6FF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
} as const;

export const font = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;
