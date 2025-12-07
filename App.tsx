import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GameState, Plot, PlantType, ToolType, GrowthStage, Decoration 
} from './types';
import { 
  INITIAL_COINS, MAX_WATER_LEVEL, WATER_DECAY_RATE, RAIN_WATER_RATE, 
  TICK_RATE_MS, PLANT_DATA, AVAILABLE_DECORATIONS, XP_TO_LEVEL_UP 
} from './constants';
import TopBar from './components/TopBar';
import ControlPanel from './components/ControlPanel';
import GardenPlot from './components/GardenPlot';
import ShopModal from './components/ShopModal';

// --- INITIAL DATA ---
const INITIAL_PLOTS: Plot[] = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  plantType: PlantType.EMPTY,
  growthProgress: 0,
  waterLevel: 50,
  stage: GrowthStage.SEED,
  isLocked: i >= 4 // Start with 4 plots
}));

const INITIAL_STATE: GameState = {
  coins: INITIAL_COINS,
  xp: 0,
  level: 1,
  plots: INITIAL_PLOTS,
  selectedTool: ToolType.HAND,
  selectedSeed: PlantType.CARROT,
  weather: 'SUNNY',
  decorations: [],
  notification: null
};

export default function App() {
  // Load state from local storage or use initial
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('zenGardenState');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [shopOpen, setShopOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- SAVE LOOP ---
  useEffect(() => {
    localStorage.setItem('zenGardenState', JSON.stringify(state));
  }, [state]);

  // --- GAME TICK LOOP ---
  useEffect(() => {
    const tick = setInterval(() => {
      setState(prev => {
        // Random Weather Change (1% chance per tick)
        let newWeather = prev.weather;
        if (Math.random() < 0.01) {
          newWeather = prev.weather === 'SUNNY' ? 'RAINY' : 'SUNNY';
        }

        // Process Plots
        const newPlots = prev.plots.map(plot => {
          if (plot.isLocked || plot.plantType === PlantType.EMPTY) return plot;
          if (plot.stage === GrowthStage.WITHERED || plot.stage === GrowthStage.READY) return plot;

          const plantInfo = PLANT_DATA[plot.plantType];
          let newWaterLevel = plot.waterLevel;
          let newProgress = plot.growthProgress;
          let newStage = plot.stage;

          // Water Logic
          if (newWeather === 'RAINY') {
            newWaterLevel = Math.min(newWaterLevel + RAIN_WATER_RATE, MAX_WATER_LEVEL);
          } else {
            newWaterLevel = Math.max(newWaterLevel - WATER_DECAY_RATE, 0);
          }

          // Growth Logic
          if (newWaterLevel > 0) {
            // Base speed * (Water bonus if well watered)
            const growthRate = plantInfo.growthSpeed * (newWaterLevel > 50 ? 1.5 : 1.0);
            newProgress += growthRate;

            // Stage Progression
            if (newProgress >= 100) {
              if (newStage < GrowthStage.READY) {
                newStage += 1;
                newProgress = 0; // Reset for next stage, or keep at 100 if ready
                if (newStage === GrowthStage.READY) newProgress = 100;
              }
            }
          } else {
            // Wither logic (chance to wither if dry for too long could be added here)
            // For now, just stop growing.
          }

          return {
             ...plot,
             waterLevel: newWaterLevel,
             growthProgress: newProgress,
             stage: newStage
          };
        });
        
        // Notifications decay
        const newNotif = Math.random() < 0.05 && prev.notification ? null : prev.notification;

        return {
          ...prev,
          weather: newWeather,
          plots: newPlots,
          notification: newNotif
        };
      });
    }, TICK_RATE_MS);

    return () => clearInterval(tick);
  }, []);

  // --- ACTIONS ---

  const showNotification = (msg: string) => {
    setState(prev => ({ ...prev, notification: msg }));
    setTimeout(() => setState(prev => ({ ...prev, notification: null })), 2000);
  };

  const handlePlotClick = (id: number) => {
    setState(prev => {
      const plot = prev.plots.find(p => p.id === id);
      if (!plot || plot.isLocked) return prev;

      let newPlots = [...prev.plots];
      let newCoins = prev.coins;
      let newXp = prev.xp;
      let newLevel = prev.level;

      const updatedPlotIndex = newPlots.findIndex(p => p.id === id);
      
      // TOOL LOGIC
      switch (prev.selectedTool) {
        case ToolType.WATER:
          if (plot.plantType !== PlantType.EMPTY) {
            newPlots[updatedPlotIndex] = { ...plot, waterLevel: MAX_WATER_LEVEL };
            showNotification("Podlano!");
          }
          break;

        case ToolType.SEED_BAG:
          if (plot.plantType === PlantType.EMPTY) {
            const seedCost = PLANT_DATA[prev.selectedSeed].cost;
            if (newCoins >= seedCost) {
              newCoins -= seedCost;
              newPlots[updatedPlotIndex] = {
                ...plot,
                plantType: prev.selectedSeed,
                stage: GrowthStage.SEED,
                growthProgress: 0,
                waterLevel: 50
              };
              showNotification(`Zasadzono ${PLANT_DATA[prev.selectedSeed].name}`);
            } else {
              showNotification("Za mało monet!");
            }
          }
          break;

        case ToolType.HARVEST:
          if (plot.stage === GrowthStage.READY) {
             const plantInfo = PLANT_DATA[plot.plantType];
             newCoins += plantInfo.sellPrice;
             newXp += plantInfo.xpReward;
             
             // Level Up Check
             const requiredXp = XP_TO_LEVEL_UP(newLevel);
             if (newXp >= requiredXp) {
                newLevel += 1;
                newXp -= requiredXp; // Overflow XP
                // Unlock plot if applicable
                const lockedPlotIndex = newPlots.findIndex(p => p.isLocked);
                if (lockedPlotIndex !== -1 && newLevel % 2 === 0) { // Unlock plot every 2 levels
                   newPlots[lockedPlotIndex] = { ...newPlots[lockedPlotIndex], isLocked: false };
                   showNotification("Nowe pole odblokowane!");
                } else {
                   showNotification("Poziom w górę!");
                }
             } else {
                showNotification(`Zebrano: +${plantInfo.sellPrice} monet`);
             }

             // Reset Plot
             newPlots[updatedPlotIndex] = {
               ...plot,
               plantType: PlantType.EMPTY,
               growthProgress: 0,
               stage: GrowthStage.SEED
             };
          } else if (plot.plantType !== PlantType.EMPTY) {
            showNotification("Jeszcze nie gotowe...");
          }
          break;

        case ToolType.SHOVEL:
          if (plot.plantType !== PlantType.EMPTY) {
            // Confirm removal? For simplicity just remove
            newPlots[updatedPlotIndex] = {
               ...plot,
               plantType: PlantType.EMPTY,
               growthProgress: 0,
               stage: GrowthStage.SEED
             };
             showNotification("Usunięto roślinę");
          }
          break;

        default:
          // Just selecting/viewing
          break;
      }

      return {
        ...prev,
        plots: newPlots,
        coins: newCoins,
        xp: newXp,
        level: newLevel
      };
    });
  };

  const handleBuySeed = (type: PlantType) => {
    setState(prev => ({
      ...prev,
      selectedSeed: type,
      selectedTool: ToolType.SEED_BAG
    }));
  };

  const handleBuyDecoration = (id: string) => {
    setState(prev => {
      const dec = AVAILABLE_DECORATIONS.find(d => d.id === id);
      if (!dec || prev.coins < dec.cost) return prev;
      
      const alreadyOwned = prev.decorations.find(d => d.id === id);
      if (alreadyOwned && alreadyOwned.purchased) return prev;

      return {
        ...prev,
        coins: prev.coins - dec.cost,
        decorations: [...prev.decorations, { ...dec, purchased: true }]
      };
    });
  };

  const handleEquipDecoration = (id: string) => {
      setState(prev => {
         const newDecor = prev.decorations.map(d => ({
            ...d,
            active: d.id === id ? !d.active : d.active // Allow multiple or toggle
         }));
         return { ...prev, decorations: newDecor };
      });
  };

  // --- RENDER HELPERS ---
  const activeDecorations = state.decorations.filter(d => d.active);

  return (
    <div className="relative w-full h-screen bg-stone-100 overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <TopBar state={state} />

      {/* Main Game Area */}
      <main className="absolute inset-0 pt-24 pb-32 px-4 flex flex-col items-center justify-center overflow-y-auto no-scrollbar">
         
         {/* Decoration Layer (Background) */}
         <div className="absolute top-10 left-0 w-full h-full pointer-events-none flex justify-center items-center opacity-20 z-0">
             {activeDecorations.map(d => (
                <span key={d.id} className="text-9xl mx-4">{d.icon}</span>
             ))}
         </div>

         {/* Garden Grid */}
         <div className="grid grid-cols-3 gap-3 w-full max-w-md z-10 relative">
            {state.plots.map(plot => (
              <GardenPlot 
                key={plot.id} 
                plot={plot} 
                onClick={handlePlotClick} 
                isRainy={state.weather === 'RAINY'}
              />
            ))}
         </div>

         {/* Notification Popup */}
         {state.notification && (
           <div className="absolute bottom-36 bg-stone-800/80 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce shadow-lg z-50 backdrop-blur-md">
             {state.notification}
           </div>
         )}
         
         {/* Help Text */}
         {state.plots.every(p => p.plantType === PlantType.EMPTY) && state.coins > 0 && (
           <div className="mt-8 text-stone-400 text-sm text-center italic animate-pulse">
             Wybierz nasiona i dotknij pola, aby zasadzić pierwszą roślinę.
           </div>
         )}

      </main>

      <ControlPanel 
        state={state}
        selectedTool={state.selectedTool} 
        selectedSeed={state.selectedSeed}
        onSelectTool={(t) => setState(prev => ({ ...prev, selectedTool: t }))}
        onOpenShop={() => setShopOpen(true)}
      />

      <ShopModal 
        isOpen={shopOpen} 
        onClose={() => setShopOpen(false)} 
        state={state}
        onBuySeed={handleBuySeed}
        onBuyDecoration={handleBuyDecoration}
        onEquipDecoration={handleEquipDecoration}
      />

    </div>
  );
}
