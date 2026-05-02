export const colors = {
  bg: '#FFFFFF',
  surface: '#F5F7FA',
  primary: '#1A5CFF',
  success: '#1B8A3E',
  danger: '#D42B2B',
  text: {
    primary: '#111827',
    muted: '#6B7280',
  },
  border: '#E5E7EB',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 9999,
} as const;

export const type = {
  display: { fontSize: 48, fontWeight: '800' as const, lineHeight: 56 },
  h1:      { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2:      { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  body:    { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
} as const;

export type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  radii: typeof radii;
  type: typeof type;
};

const theme: Theme = { colors, spacing, radii, type };
export default theme;
