import React from 'react';
import { colors } from '../theme/tokens';

interface StatGaugeProps {
  value: number;
  max: number;
  label: string;
  size?: number;
  color?: string;
}

export function StatGauge({ value, max, label, size = 120, color }: StatGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const fillColor =
    color ??
    (percentage > 66 ? colors.forestGreen : percentage > 33 ? colors.warmGold : colors.deepRed);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Compass rose decoration */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 4}
          fill="none"
          stroke={colors.mediumBrown}
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="gauge-track"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="gauge-fill"
          stroke={fillColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Value text */}
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={colors.darkBrown}
          fontSize={size / 4}
          fontFamily="'EB Garamond', serif"
          fontWeight="600"
        >
          {Math.round(percentage)}%
        </text>
        <text
          x={size / 2}
          y={size / 2 + size / 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={colors.slate}
          fontSize={size / 10}
          fontFamily="'EB Garamond', serif"
        >
          {value}/{max}
        </text>
      </svg>
      <span className="text-sm text-slate font-medieval">{label}</span>
    </div>
  );
}
