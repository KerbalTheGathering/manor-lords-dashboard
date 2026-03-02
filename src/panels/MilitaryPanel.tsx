import React from 'react';
import { MedievalCard } from '../components/MedievalCard';
import { StatGauge } from '../components/StatGauge';
import type { SettlementData } from '../types/settlement';
import { colors } from '../theme/tokens';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface Props {
  data: SettlementData;
}

export function MilitaryPanel({ data }: Props) {
  const { military } = data;

  const totalTroops = military.retinue.reduce((sum, u) => sum + u.count, 0);

  const equipmentData = military.equipment.map((e) => ({
    name: e.type,
    amount: e.amount,
    rate: e.productionRate,
  }));

  const threatColor =
    military.threatLevel > 66
      ? colors.deepRed
      : military.threatLevel > 33
      ? colors.warmGold
      : colors.forestGreen;

  const threatLabel =
    military.threatLevel > 66
      ? 'High Danger'
      : military.threatLevel > 33
      ? 'Moderate'
      : 'Peaceful';

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl text-parchment">Military Readiness</h2>

      {/* Top row: Threat & Force Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MedievalCard title="Threat Assessment">
          <div className="flex flex-col items-center gap-2">
            <StatGauge
              value={military.threatLevel}
              max={100}
              label="Threat Level"
              size={130}
              color={threatColor}
            />
            <div
              className="text-sm font-medieval font-semibold px-3 py-1 rounded"
              style={{ color: threatColor, backgroundColor: threatColor + '18' }}
            >
              {threatLabel}
            </div>
          </div>
        </MedievalCard>

        <MedievalCard title="Force Composition">
          <div className="text-center mb-3">
            <span className="text-3xl font-medieval font-bold text-dark-brown">{totalTroops}</span>
            <span className="text-sm text-slate ml-2">active troops</span>
          </div>
          <div className="space-y-2">
            {military.retinue.map((unit) => (
              <div key={unit.type} className="flex items-center gap-3">
                <div className="w-32 font-medieval text-sm">{unit.type}</div>
                <div className="flex-1 h-5 bg-light-tan rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(unit.count / totalTroops) * 100}%`,
                      backgroundColor: colors.mediumBrown,
                    }}
                  />
                </div>
                <div className="w-8 text-right text-sm font-medieval font-semibold">{unit.count}</div>
                <div className="text-xs text-slate">T{unit.equipmentTier}</div>
              </div>
            ))}
          </div>
        </MedievalCard>

        <MedievalCard title="Militia">
          <div className="flex justify-center gap-6">
            <StatGauge
              value={military.militiaMustered}
              max={military.militiaAvailable}
              label="Mustered"
              size={100}
            />
          </div>
          <div className="mt-3 text-center text-sm text-slate font-medieval">
            {military.militiaAvailable - military.militiaMustered} eligible villagers available
          </div>
        </MedievalCard>
      </div>

      {/* Equipment stockpile */}
      <MedievalCard title="Equipment Stockpile">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={equipmentData}>
            <XAxis dataKey="name" stroke={colors.mediumBrown} fontSize={12} fontFamily="'EB Garamond'" />
            <YAxis stroke={colors.mediumBrown} fontSize={12} fontFamily="'EB Garamond'" />
            <Tooltip
              contentStyle={{
                background: colors.parchment,
                border: `1px solid ${colors.mediumBrown}`,
                fontFamily: "'EB Garamond'",
              }}
              formatter={(value: number, name: string) => [value, name === 'amount' ? 'In Stock' : 'Rate/mo']}
            />
            <Bar dataKey="amount" name="In Stock" radius={[4, 4, 0, 0]}>
              {equipmentData.map((_, i) => (
                <Cell key={i} fill={colors.mediumBrown} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {equipmentData.map((e) => (
            <div key={e.name} className="text-center text-xs text-slate">
              +{e.rate}/mo
            </div>
          ))}
        </div>
      </MedievalCard>

      {/* Battle Log */}
      <MedievalCard title="Battle Chronicle">
        {military.battleLog.length === 0 ? (
          <p className="text-slate font-medieval italic">No battles recorded.</p>
        ) : (
          <table className="medieval-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>Outcome</th>
                <th>Casualties</th>
              </tr>
            </thead>
            <tbody>
              {military.battleLog.map((battle, i) => (
                <tr key={i}>
                  <td className="font-medieval">{battle.date}</td>
                  <td className="font-medieval">{battle.opponent}</td>
                  <td>
                    <span
                      className="px-2 py-0.5 rounded text-sm font-medieval font-semibold"
                      style={{
                        color:
                          battle.outcome === 'Victory'
                            ? colors.forestGreen
                            : battle.outcome === 'Defeat'
                            ? colors.deepRed
                            : colors.warmGold,
                        backgroundColor:
                          (battle.outcome === 'Victory'
                            ? colors.forestGreen
                            : battle.outcome === 'Defeat'
                            ? colors.deepRed
                            : colors.warmGold) + '18',
                      }}
                    >
                      {battle.outcome}
                    </span>
                  </td>
                  <td className="font-medieval">{battle.casualties}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </MedievalCard>
    </div>
  );
}
