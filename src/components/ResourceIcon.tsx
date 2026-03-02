import React from 'react';
import { colors } from '../theme/tokens';

interface ResourceIconProps {
  resource: string;
  size?: number;
}

const resourceSymbols: Record<string, string> = {
  Timber: 'T',
  Stone: 'S',
  Iron: 'Fe',
  Wheat: 'W',
  Flour: 'F',
  Leather: 'L',
  Wool: 'Wl',
  Ale: 'A',
  Bread: 'B',
  Berries: 'Br',
  Meat: 'M',
  Vegetables: 'V',
  Logs: 'Lg',
  Hides: 'H',
  Barley: 'Ba',
  Sheep: 'Sh',
  'Iron Ore': 'Or',
};

export function ResourceIcon({ resource, size = 32 }: ResourceIconProps) {
  const symbol = resourceSymbols[resource] ?? resource.charAt(0);
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect x="1" y="1" width="30" height="30" rx="4" fill={colors.lightTan} stroke={colors.mediumBrown} strokeWidth="1.5" />
      <text
        x="16"
        y="17"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={colors.darkBrown}
        fontSize="11"
        fontFamily="'EB Garamond', serif"
        fontWeight="600"
      >
        {symbol}
      </text>
    </svg>
  );
}
