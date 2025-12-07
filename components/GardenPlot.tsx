import React from 'react';
import { Plot, PlantType, GrowthStage } from '../types';
import { PLANT_DATA } from '../constants';
import { Droplets, CloudRain } from 'lucide-react';

interface GardenPlotProps {
  plot: Plot;
  onClick: (id: number) => void;
  isRainy: boolean;
}

const GardenPlot: React.FC<GardenPlotProps> = ({ plot, onClick, isRainy }) => {
  const plantInfo = PLANT_DATA[plot.plantType];

  // Visual helper for plant growth
  const getPlantVisual = () => {
    if (plot.plantType === PlantType.EMPTY) return null;
    
    switch (plot.stage) {
      case GrowthStage.SEED: return <span className="text-xl opacity-50">🌱</span>;
      case GrowthStage.SPROUT: return <span className="text-2xl scale-75 block">{plantInfo.icon}</span>;
      case GrowthStage.BLOOM: return <span className="text-3xl scale-90 block">{plantInfo.icon}</span>;
      case GrowthStage.READY: return <span className="text-4xl animate-bounce block">{plantInfo.icon}</span>;
      case GrowthStage.WITHERED: return <span className="text-3xl grayscale opacity-60">🥀</span>;
      default: return null;
    }
  };

  // Background color based on moisture
  const getGroundColor = () => {
    if (plot.isLocked) return 'bg-stone-300';
    // Darker brown when wet
    const wetness = plot.waterLevel / 100;
    // Interpolating roughly between light dirt and dark mud
    return plot.waterLevel > 50 ? 'bg-amber-900/60' : 'bg-amber-200/50';
  };

  return (
    <button
      onClick={() => onClick(plot.id)}
      disabled={plot.isLocked}
      className={`
        relative aspect-square w-full rounded-xl transition-all duration-300 transform active:scale-95
        border-4 border-stone-100 shadow-sm
        flex flex-col items-center justify-center
        ${getGroundColor()}
        ${plot.isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-md'}
      `}
    >
      {plot.isLocked ? (
        <span className="text-stone-400 text-xs font-bold uppercase">Blokada</span>
      ) : (
        <>
          {/* Plant Icon */}
          <div className="z-10 transition-all duration-500">
            {getPlantVisual()}
          </div>

          {/* Water Indicator */}
          {plot.plantType !== PlantType.EMPTY && plot.stage !== GrowthStage.WITHERED && plot.stage !== GrowthStage.READY && (
            <div className="absolute bottom-1 right-1 flex items-center gap-0.5">
               {plot.waterLevel < 30 && !isRainy && (
                 <div className="bg-red-100 p-0.5 rounded-full animate-pulse">
                    <Droplets size={12} className="text-red-500" />
                 </div>
               )}
               {isRainy && (
                 <CloudRain size={12} className="text-blue-500 animate-pulse" />
               )}
            </div>
          )}

          {/* Progress Bar (Only when growing) */}
          {plot.plantType !== PlantType.EMPTY && plot.stage < GrowthStage.READY && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-stone-800/10 overflow-hidden rounded-b-lg">
              <div 
                className="h-full bg-green-500 transition-all duration-1000"
                style={{ width: `${plot.growthProgress}%` }}
              />
            </div>
          )}
        </>
      )}
    </button>
  );
};

export default GardenPlot;
