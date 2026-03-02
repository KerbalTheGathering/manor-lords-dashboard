// Electron-side settlement store (mirrors MCP store for direct IPC access)
import type { SettlementData } from '../src/types/settlement';

export class SettlementStore {
  private settlements: Map<string, SettlementData> = new Map();

  constructor() {
    this.settlements.set('default', this.getDefaultData());
  }

  getSettlement(id: string): SettlementData | undefined {
    return this.settlements.get(id);
  }

  setSettlement(id: string, data: SettlementData): void {
    this.settlements.set(id, data);
  }

  updateField(id: string, field: string, value: any): boolean {
    const settlement = this.settlements.get(id);
    if (!settlement) return false;
    const parts = field.split('.');
    let target: any = settlement;
    for (let i = 0; i < parts.length - 1; i++) {
      target = target[parts[i]];
      if (target === undefined) return false;
    }
    target[parts[parts.length - 1]] = value;
    return true;
  }

  getDefaultData(): SettlementData {
    return {
      id: 'default',
      name: 'Ashford Village',
      population: 147,
      populationHistory: [42, 58, 73, 89, 102, 118, 131, 147],
      approvalRating: 72,
      season: 'Summer',
      year: 3,
      treasury: 245,
      churchLevel: 1,
      housing: { occupied: 28, available: 35, level1: 20, level2: 12, level3: 3 },
      food: {
        total: 320,
        consumption: 18,
        types: [
          { name: 'Bread', amount: 120 },
          { name: 'Berries', amount: 85 },
          { name: 'Meat', amount: 65 },
          { name: 'Vegetables', amount: 50 },
        ],
      },
      resources: [
        { name: 'Timber', amount: 180, production: 12, consumption: 8, trend: [150, 155, 162, 170, 175, 180] },
        { name: 'Stone', amount: 95, production: 6, consumption: 4, trend: [60, 68, 75, 82, 88, 95] },
        { name: 'Iron', amount: 32, production: 3, consumption: 5, trend: [45, 42, 40, 38, 35, 32] },
        { name: 'Wheat', amount: 210, production: 15, consumption: 12, trend: [180, 185, 190, 198, 205, 210] },
        { name: 'Flour', amount: 85, production: 10, consumption: 8, trend: [70, 74, 78, 80, 82, 85] },
        { name: 'Leather', amount: 40, production: 4, consumption: 3, trend: [25, 28, 32, 35, 38, 40] },
        { name: 'Wool', amount: 55, production: 5, consumption: 2, trend: [30, 35, 40, 45, 50, 55] },
        { name: 'Ale', amount: 28, production: 3, consumption: 4, trend: [35, 33, 32, 30, 29, 28] },
      ],
      military: {
        retinue: [
          { type: 'Men-at-Arms', count: 12, equipmentTier: 2 },
          { type: 'Archers', count: 8, equipmentTier: 1 },
          { type: 'Militia Spearmen', count: 15, equipmentTier: 1 },
        ],
        militiaAvailable: 45,
        militiaMustered: 15,
        equipment: [
          { type: 'Swords', amount: 18, productionRate: 2 },
          { type: 'Shields', amount: 22, productionRate: 3 },
          { type: 'Bows', amount: 12, productionRate: 1 },
          { type: 'Armor', amount: 8, productionRate: 1 },
          { type: 'Spears', amount: 25, productionRate: 2 },
        ],
        threatLevel: 35,
        battleLog: [
          { date: 'Year 2, Autumn', opponent: 'Bandit Raiders', outcome: 'Victory', casualties: 3 },
          { date: 'Year 3, Spring', opponent: "Baron's Levy", outcome: 'Victory', casualties: 7 },
        ],
      },
      resourceChains: [
        { source: 'Wheat', intermediate: 'Flour', product: 'Bread', sourceRate: 15, productRate: 8, efficiency: 0.75 },
        { source: 'Logs', product: 'Timber', sourceRate: 14, productRate: 12, efficiency: 0.85 },
        { source: 'Iron Ore', product: 'Iron', sourceRate: 4, productRate: 3, efficiency: 0.70 },
        { source: 'Hides', product: 'Leather', sourceRate: 5, productRate: 4, efficiency: 0.80 },
        { source: 'Barley', product: 'Ale', sourceRate: 5, productRate: 3, efficiency: 0.60 },
        { source: 'Sheep', product: 'Wool', sourceRate: 6, productRate: 5, efficiency: 0.83 },
      ],
      history: [
        { year: 1, season: 'Spring', population: 42, approval: 80, treasury: 50 },
        { year: 1, season: 'Summer', population: 58, approval: 78, treasury: 75 },
        { year: 1, season: 'Autumn', population: 73, approval: 75, treasury: 110 },
        { year: 1, season: 'Winter', population: 70, approval: 65, treasury: 90 },
        { year: 2, season: 'Spring', population: 89, approval: 70, treasury: 130 },
        { year: 2, season: 'Summer', population: 102, approval: 74, treasury: 165 },
        { year: 2, season: 'Autumn', population: 118, approval: 68, treasury: 200 },
        { year: 2, season: 'Winter', population: 115, approval: 62, treasury: 180 },
        { year: 3, season: 'Spring', population: 131, approval: 70, treasury: 220 },
        { year: 3, season: 'Summer', population: 147, approval: 72, treasury: 245 },
      ],
    };
  }
}
