import React, { useState } from 'react';
import { SettlementOverview } from './panels/SettlementOverview';
import { ResourceFlow } from './panels/ResourceFlow';
import { MilitaryPanel } from './panels/MilitaryPanel';
import { StrategyConsole } from './panels/StrategyConsole';
import { useSettlement } from './hooks/useSettlement';

type Panel = 'overview' | 'resources' | 'military' | 'strategy';

const navItems: { id: Panel; label: string; icon: string }[] = [
  { id: 'overview', label: 'Settlement', icon: '\u{1F3F0}' },
  { id: 'resources', label: 'Resources', icon: '\u{2692}' },
  { id: 'military', label: 'Military', icon: '\u{2694}' },
  { id: 'strategy', label: 'Strategy', icon: '\u{1F4DC}' },
];

function App() {
  const [activePanel, setActivePanel] = useState<Panel>('overview');
  const { data, loading, updateField } = useSettlement('default');

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-brown flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">{'\u{1F3F0}'}</div>
          <p className="font-display text-2xl text-parchment">Loading Settlement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-dark-brown">
      {/* Sidebar Navigation */}
      <nav className="nav-sidebar w-56 flex-shrink-0 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-warm-gold/30">
          <h1 className="font-display text-xl text-warm-gold leading-tight">Manor Lords</h1>
          <p className="text-xs text-light-tan/70 font-medieval mt-1">Dashboard</p>
        </div>

        {/* Settlement name */}
        <div className="px-4 py-3 border-b border-warm-gold/10">
          <div className="text-xs text-light-tan/50 font-medieval uppercase tracking-wider">Settlement</div>
          <div className="font-medieval text-parchment mt-0.5">{data.name}</div>
        </div>

        {/* Nav items */}
        <div className="flex-1 py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={`nav-item w-full text-left ${activePanel === item.id ? 'active' : ''}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-warm-gold/10 text-xs text-light-tan/40 font-medieval">
          <div>Year {data.year} &middot; {data.season}</div>
          <div className="mt-1">Pop: {data.population}</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activePanel === 'overview' && (
          <SettlementOverview data={data} onUpdateField={updateField} />
        )}
        {activePanel === 'resources' && <ResourceFlow data={data} />}
        {activePanel === 'military' && <MilitaryPanel data={data} />}
        {activePanel === 'strategy' && <StrategyConsole data={data} />}
      </main>
    </div>
  );
}

export default App;
