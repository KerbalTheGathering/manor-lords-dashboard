export const colors = {
  parchment: '#F5ECD7',
  darkBrown: '#3C2415',
  mediumBrown: '#6B4226',
  warmGold: '#C5973B',
  deepRed: '#8B2500',
  forestGreen: '#2E5230',
  slate: '#4A4A4A',
  lightTan: '#E8DCC8',
} as const;

export const chartColors = [
  colors.warmGold,
  colors.forestGreen,
  colors.deepRed,
  colors.mediumBrown,
  colors.slate,
  colors.darkBrown,
] as const;

export const fonts = {
  medieval: "'EB Garamond', Georgia, serif",
  display: "'MedievalSharp', cursive",
  mono: "'Fira Code', monospace",
} as const;
