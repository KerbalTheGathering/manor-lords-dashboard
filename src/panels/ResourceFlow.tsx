import React from 'react';
import { MedievalCard } from '../components/MedievalCard';
import { ResourceIcon } from '../components/ResourceIcon';
import type { SettlementData, ResourceChain, ResourceData } from '../types/settlement';
import { colors, chartColors } from '../theme/tokens';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  data: SettlementData;
}

function SankeyDiagram({ chains }: { chains: ResourceChain[] }) {
  const width = 700;
  const height = 300;
  const nodeWidth = 100;
  const padding = 40;
  const nodeH = 36;

  // Collect unique source, intermediate, and product nodes
  const sources = [...new Set(chains.map((c) => c.source))];
  const intermediates = [...new Set(chains.filter((c) => c.intermediate).map((c) => c.intermediate!))];
  const products = [...new Set(chains.map((c) => c.product))];

  const getY = (list: string[], idx: number) =>
    padding + idx * (nodeH + 16);

  const getColor = (efficiency: number) =>
    efficiency >= 0.8 ? colors.forestGreen : efficiency >= 0.6 ? colors.warmGold : colors.deepRed;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="font-medieval">
      {/* Source nodes */}
      {sources.map((name, i) => (
        <g key={`src-${name}`}>
          <rect x={0} y={getY(sources, i)} width={nodeWidth} height={nodeH} rx={4} fill={colors.lightTan} stroke={colors.mediumBrown} />
          <text x={nodeWidth / 2} y={getY(sources, i) + nodeH / 2} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill={colors.darkBrown}>{name}</text>
        </g>
      ))}

      {/* Intermediate nodes */}
      {intermediates.map((name, i) => (
        <g key={`mid-${name}`}>
          <rect x={width / 2 - nodeWidth / 2} y={getY(intermediates, i)} width={nodeWidth} height={nodeH} rx={4} fill={colors.lightTan} stroke={colors.mediumBrown} />
          <text x={width / 2} y={getY(intermediates, i) + nodeH / 2} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill={colors.darkBrown}>{name}</text>
        </g>
      ))}

      {/* Product nodes */}
      {products.map((name, i) => (
        <g key={`prod-${name}`}>
          <rect x={width - nodeWidth} y={getY(products, i)} width={nodeWidth} height={nodeH} rx={4} fill={colors.lightTan} stroke={colors.warmGold} strokeWidth={2} />
          <text x={width - nodeWidth / 2} y={getY(products, i) + nodeH / 2} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill={colors.darkBrown} fontWeight="600">{name}</text>
        </g>
      ))}

      {/* Flow links */}
      {chains.map((chain, idx) => {
        const srcIdx = sources.indexOf(chain.source);
        const prodIdx = products.indexOf(chain.product);
        const midIdx = chain.intermediate ? intermediates.indexOf(chain.intermediate) : -1;
        const flowColor = getColor(chain.efficiency);

        if (midIdx >= 0) {
          const sy = getY(sources, srcIdx) + nodeH / 2;
          const my = getY(intermediates, midIdx) + nodeH / 2;
          const ey = getY(products, prodIdx) + nodeH / 2;
          return (
            <g key={`flow-${idx}`}>
              <path
                d={`M ${nodeWidth} ${sy} C ${nodeWidth + 60} ${sy}, ${width / 2 - nodeWidth / 2 - 60} ${my}, ${width / 2 - nodeWidth / 2} ${my}`}
                fill="none" stroke={flowColor} strokeWidth={3} opacity={0.6}
              />
              <path
                d={`M ${width / 2 + nodeWidth / 2} ${my} C ${width / 2 + nodeWidth / 2 + 60} ${my}, ${width - nodeWidth - 60} ${ey}, ${width - nodeWidth} ${ey}`}
                fill="none" stroke={flowColor} strokeWidth={3} opacity={0.6}
              />
              <text x={width / 2 - nodeWidth / 2 - 14} y={my - 8} fontSize={9} fill={colors.slate}>{chain.sourceRate}/mo</text>
              <text x={width - nodeWidth - 40} y={ey - 8} fontSize={9} fill={colors.slate}>{chain.productRate}/mo</text>
            </g>
          );
        } else {
          const sy = getY(sources, srcIdx) + nodeH / 2;
          const ey = getY(products, prodIdx) + nodeH / 2;
          return (
            <g key={`flow-${idx}`}>
              <path
                d={`M ${nodeWidth} ${sy} C ${width / 3} ${sy}, ${(2 * width) / 3} ${ey}, ${width - nodeWidth} ${ey}`}
                fill="none" stroke={flowColor} strokeWidth={3} opacity={0.6}
              />
              <text x={width / 2 - 20} y={(sy + ey) / 2 - 8} fontSize={9} fill={colors.slate}>
                {Math.round(chain.efficiency * 100)}% eff
              </text>
            </g>
          );
        }
      })}
    </svg>
  );
}

export function ResourceFlow({ data }: Props) {
  const resourceTrends = data.resources.map((r) => ({
    ...r,
    trendData: r.trend.map((v, i) => ({ period: i + 1, value: v })),
    netRate: r.production - r.consumption,
  }));

  const bottlenecks = resourceTrends.filter((r) => r.netRate < 0);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl text-parchment">Resource Flow</h2>

      {/* Sankey Diagram */}
      <MedievalCard title="Production Chains">
        <SankeyDiagram chains={data.resourceChains} />
        <div className="flex gap-4 mt-3 text-xs text-slate font-medieval">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.forestGreen }} /> High Efficiency
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.warmGold }} /> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.deepRed }} /> Low / Bottleneck
          </span>
        </div>
      </MedievalCard>

      {/* Bottleneck alerts */}
      {bottlenecks.length > 0 && (
        <MedievalCard title="Bottleneck Warning">
          <div className="space-y-2">
            {bottlenecks.map((r) => (
              <div key={r.name} className="flex items-center gap-3 p-2 rounded" style={{ backgroundColor: colors.deepRed + '15' }}>
                <ResourceIcon resource={r.name} />
                <div className="flex-1">
                  <span className="font-medieval font-semibold text-dark-brown">{r.name}</span>
                  <span className="text-sm text-deep-red ml-2">
                    Deficit: {Math.abs(r.netRate)}/month
                  </span>
                </div>
                <span className="text-xs text-slate">
                  {r.amount} remaining ({Math.floor(r.amount / Math.abs(r.netRate))} months)
                </span>
              </div>
            ))}
          </div>
        </MedievalCard>
      )}

      {/* Resource table with sparklines */}
      <MedievalCard title="Resource Inventory">
        <table className="medieval-table">
          <thead>
            <tr>
              <th></th>
              <th>Resource</th>
              <th>Stock</th>
              <th>Production</th>
              <th>Consumption</th>
              <th>Net</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {resourceTrends.map((r) => (
              <tr key={r.name}>
                <td><ResourceIcon resource={r.name} size={24} /></td>
                <td className="font-medieval font-semibold">{r.name}</td>
                <td>{r.amount}</td>
                <td className="text-forest-green">+{r.production}</td>
                <td className="text-deep-red">-{r.consumption}</td>
                <td style={{ color: r.netRate >= 0 ? colors.forestGreen : colors.deepRed, fontWeight: 600 }}>
                  {r.netRate >= 0 ? '+' : ''}{r.netRate}
                </td>
                <td>
                  <ResponsiveContainer width={80} height={30}>
                    <LineChart data={r.trendData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={r.netRate >= 0 ? colors.forestGreen : colors.deepRed}
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </MedievalCard>
    </div>
  );
}
