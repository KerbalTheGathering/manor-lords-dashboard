import React from 'react';
import type { Season } from '../types/settlement';

interface SeasonTrackerProps {
  season: Season;
  year: number;
}

const seasonEmoji: Record<Season, string> = {
  Spring: '\u{1F331}',
  Summer: '\u{2600}',
  Autumn: '\u{1F342}',
  Winter: '\u{2744}',
};

const seasonColors: Record<Season, string> = {
  Spring: '#2E5230',
  Summer: '#C5973B',
  Autumn: '#8B2500',
  Winter: '#4A4A4A',
};

export function SeasonTracker({ season, year }: SeasonTrackerProps) {
  return (
    <div className="flex items-center gap-3 medieval-card p-3">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
        style={{ backgroundColor: seasonColors[season] + '22', border: `2px solid ${seasonColors[season]}` }}
      >
        {seasonEmoji[season]}
      </div>
      <div>
        <div className="font-display text-lg text-dark-brown">{season}</div>
        <div className="text-sm text-slate font-medieval">Year {year}</div>
      </div>
    </div>
  );
}
