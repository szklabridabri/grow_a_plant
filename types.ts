export enum PlantType {
  EMPTY = 'EMPTY',
  CARROT = 'CARROT',      // Fast, low reward
  SUNFLOWER = 'SUNFLOWER',// Slow, high reward
  LAVENDER = 'LAVENDER',  // Medium, looks nice
  ROSE = 'ROSE'           // Very slow, very high reward
}

export enum GrowthStage {
  SEED = 0,
  SPROUT = 1,
  BLOOM = 2,
  READY = 3,
  WITHERED = 4
}

export enum ToolType {
  HAND = 'HAND',       // Inspect
  SHOVEL = 'SHOVEL',   // Remove dead/unwanted
  WATER = 'WATER',     // Water plants
  HARVEST = 'HARVEST', // Collect
  SEED_BAG = 'SEED_BAG'// Plant
}

export interface Plot {
  id: number;
  plantType: PlantType;
  growthProgress: number; // 0 to 100
  waterLevel: number; // 0 to 100
  stage: GrowthStage;
  isLocked: boolean;
}

export interface Item {
  id: string;
  name: string;
  cost: number;
  sellPrice: number;
  growthSpeed: number; // Higher is faster
  xpReward: number;
  icon: string;
  description: string;
  levelReq: number;
}

export interface Decoration {
  id: string;
  name: string;
  cost: number;
  icon: string;
  purchased: boolean;
  active: boolean;
  effect?: string;
}

export interface GameState {
  coins: number;
  xp: number;
  level: number;
  plots: Plot[];
  selectedTool: ToolType;
  selectedSeed: PlantType;
  weather: 'SUNNY' | 'RAINY';
  decorations: Decoration[];
  notification: string | null;
}
