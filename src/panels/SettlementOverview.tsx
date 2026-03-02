import React from 'react';
import { MedievalCard } from '../components/MedievalCard';
import { StatGauge } from '../components/StatGauge';
import { SeasonTracker } from '../components/SeasonTracker';
import type { SettlementData } from '../types/settlement';
import { colors, chartColors } from '../theme/tokens';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

interface Props {
  data: SettlementData;
  onUpdateField: (field: string, value: any) => void;
}

export function SettlementOverview({ data, onUpdateField }: Props) {
  const populationData = data.populationHistory.map((val, i) => ({
    period: i + 1,
    population: val,
  }));

  const foodData = data.food.types.map((t) => ({
    name: t.name,
    amount: t.amount,
  }));

  const housingData = [
    { name: 'Level 1', value: data.housing.level1 },
    { name: 'Level 2', value: data.housing.level2 },
    { name: 'Level 3', value: data.housing.level3 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl text-parchment">Settlement Overview</h2>

      {/* Top row: Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MedievalCard>
          <div className="text-center">
            <div className="text-sm text-slate font-medieval">Population</div>
            <div className="text-4xl font-medieval font-bold text-dark-brown">{data.population}</div>
            <div className="text-xs text-forest-green mt-1">
              {data.population > (data.populationHistory[data.populationHistory.length - 2] ?? 0)
                ? 'Growing'
                : 'Declining'}
            </div>
          </div>
        </MedievalCard>

        <MedievalCard>
          <div className="flex justify-center">
            <StatGauge value={data.approvalRating} max={100} label="Approval" size={100} />
          </div>
        </MedievalCard>

        <SeasonTracker season={data.season} year={data.year} />

        <MedievalCard>
          <div className="text-center">
            <div className="text-sm text-slate font-medieval">Treasury</div>
            <div className="text-3xl font-medieval font-bold" style={{ color: colors.warmGold }}>
              {data.treasury}
            </div>
            <div className="text-xs text-slate">Regional Wealth</div>
          </div>
        </MedievalCard>
      </div>

      {/* Second row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MedievalCard title="Population Growth">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={populationData}>
              <XAxis dataKey="period" stroke={colors.mediumBrown} fontSize={12} fontFamily="'EB Garamond'" />
              <YAxis stroke={colors.mediumBrown} fontSize={12} fontFamily="'EB Garamond'" />
              <Tooltip
                contentStyle={{
                  background: colors.parchment,
                  border: `1px solid ${colors.mediumBrown}`,
                  fontFamily: "'EB Garamond'",
                }}
              />
              <Line
                type="monotone"
                dataKey="population"
                stroke={colors.forestGreen}
                strokeWidth={2}
                dot={{ fill: colors.forestGreen, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </MedievalCard>

        <MedievalCard title="Food Stores">
          <div className="mb-2 text-sm text-slate">
            Daily consumption: <strong>{data.food.consumption}</strong> | Days remaining:{' '}
            <strong>{Math.floor(data.food.total / data.food.consumption)}</strong>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={foodData}>
              <XAxis dataKey="name" stroke={colors.mediumBrown} fontSize={12} fontFamily="'EB Garamond'" />
              <YAxis stroke={colors.mediumBrown} fontSize={12} fontFamily="'EB Garamond'" />
              <Tooltip
                contentStyle={{
                  background: colors.parchment,
                  border: `1px solid ${colors.mediumBrown}`,
                  fontFamily: "'EB Garamond'",
                }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {foodData.map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </MedievalCard>
      </div>

      {/* Third row: Housing and Church */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MedievalCard title="Housing">
          <div className="flex items-center gap-6">
            <StatGauge
              value={data.housing.occupied}
              max={data.housing.available}
              label="Occupancy"
              size={100}
            />
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={housingData} layout="vertical">
                  <XAxis type="number" stroke={colors.mediumBrown} fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke={colors.mediumBrown} fontSize={12} width={60} fontFamily="'EB Garamond'" />
                  <Tooltip
                    contentStyle={{
                      background: colors.parchment,
                      border: `1px solid ${colors.mediumBrown}`,
                      fontFamily: "'EB Garamond'",
                    }}
                  />
                  <Bar dataKey="value" fill={colors.warmGold} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </MedievalCard>

        <MedievalCard title="Church & Faith">
          <div className="flex items-center gap-4">
            <div className="text-5xl">&#9775;</div>
            <div>
              <div className="font-medieval text-lg text-dark-brown">
                Level {data.churchLevel}
              </div>
              <div className="w-48 h-3 bg-light-tan rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(data.churchLevel / 3) * 100}%`,
                    backgroundColor: colors.warmGold,
                  }}
                />
              </div>
              <div className="text-xs text-slate mt-1">Progress to next tier</div>
            </div>
          </div>
        </MedievalCard>
      </div>
    </div>
  );
}
