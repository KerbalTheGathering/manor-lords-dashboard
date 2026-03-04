// Settlement types duplicated for Electron main process (rootDir constraint)
export interface SettlementData {
  id: string;
  name: string;
  population: number;
  populationHistory: number[];
  approvalRating: number;
  season: Season;
  year: number;
  treasury: number;
  churchLevel: number;
  housing: HousingData;
  food: FoodData;
  resources: ResourceData[];
  military: MilitaryData;
  resourceChains: ResourceChain[];
  history: HistoryEntry[];
}

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface HousingData {
  occupied: number;
  available: number;
  level1: number;
  level2: number;
  level3: number;
}

export interface FoodData {
  total: number;
  consumption: number;
  types: { name: string; amount: number }[];
}

export interface ResourceData {
  name: string;
  amount: number;
  production: number;
  consumption: number;
  trend: number[];
}

export interface MilitaryData {
  retinue: TroopUnit[];
  militiaAvailable: number;
  militiaMustered: number;
  equipment: EquipmentStock[];
  threatLevel: number;
  battleLog: BattleEntry[];
}

export interface TroopUnit {
  type: string;
  count: number;
  equipmentTier: number;
}

export interface EquipmentStock {
  type: string;
  amount: number;
  productionRate: number;
}

export interface BattleEntry {
  date: string;
  opponent: string;
  outcome: 'Victory' | 'Defeat' | 'Draw';
  casualties: number;
}

export interface ResourceChain {
  source: string;
  intermediate?: string;
  product: string;
  sourceRate: number;
  productRate: number;
  efficiency: number;
}

export interface HistoryEntry {
  year: number;
  season: Season;
  population: number;
  approval: number;
  treasury: number;
}
