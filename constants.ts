import { Item, PlantType, Decoration } from './types';

export const INITIAL_COINS = 50;
export const MAX_WATER_LEVEL = 100;
export const WATER_DECAY_RATE = 2; // Water lost per tick
export const RAIN_WATER_RATE = 10; // Water gained per tick during rain
export const TICK_RATE_MS = 1000; // Game loop speed

export const PLANT_DATA: Record<PlantType, Item> = {
  [PlantType.EMPTY]: {
    id: 'empty',
    name: 'Pusto',
    cost: 0,
    sellPrice: 0,
    growthSpeed: 0,
    xpReward: 0,
    icon: '🟫',
    description: 'Pusta ziemia',
    levelReq: 0
  },
  [PlantType.CARROT]: {
    id: 'carrot',
    name: 'Marchewka',
    cost: 5,
    sellPrice: 12,
    growthSpeed: 10,
    xpReward: 10,
    icon: '🥕',
    description: 'Rośnie szybko i łatwo.',
    levelReq: 1
  },
  [PlantType.LAVENDER]: {
    id: 'lavender',
    name: 'Lawenda',
    cost: 15,
    sellPrice: 35,
    growthSpeed: 5,
    xpReward: 25,
    icon: '🪻',
    description: 'Pięknie pachnie i relaksuje.',
    levelReq: 2
  },
  [PlantType.SUNFLOWER]: {
    id: 'sunflower',
    name: 'Słonecznik',
    cost: 40,
    sellPrice: 90,
    growthSpeed: 3,
    xpReward: 50,
    icon: '🌻',
    description: 'Kocha słońce, duży zysk.',
    levelReq: 4
  },
  [PlantType.ROSE]: {
    id: 'rose',
    name: 'Róża',
    cost: 100,
    sellPrice: 250,
    growthSpeed: 1,
    xpReward: 100,
    icon: '🌹',
    description: 'Królowa kwiatów. Wymaga cierpliwości.',
    levelReq: 7
  }
};

export const AVAILABLE_DECORATIONS: Decoration[] = [
  { id: 'rock', name: 'Omszały Kamień', cost: 100, icon: '🪨', purchased: false, active: false, effect: 'Ozdoba' },
  { id: 'lantern', name: 'Latarnia Ogrodowa', cost: 250, icon: '🏮', purchased: false, active: false, effect: 'Ozdoba' },
  { id: 'gnome', name: 'Krasnal', cost: 500, icon: '🎅', purchased: false, active: false, effect: 'Szczęście +1' },
  { id: 'fountain', name: 'Fontanna', cost: 1000, icon: '⛲', purchased: false, active: false, effect: 'Nawadnianie +' }
];

export const XP_TO_LEVEL_UP = (level: number) => level * 100;
