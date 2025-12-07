import React from 'react';
import { GameState } from '../types';
import { Coins, Star, CloudSun, CloudRain } from 'lucide-react';
import { XP_TO_LEVEL_UP } from '../constants';

interface TopBarProps {
  state: GameState;
}

const TopBar: React.FC<TopBarProps> = ({ state }) => {
  const xpNeeded = XP_TO_LEVEL_UP(state.level);
  const xpProgress = (state.xp / xpNeeded) * 100;

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-b-3xl shadow-sm border-b border-stone-200 w-full flex justify-between items-center z-50 fixed top-0 left-0 max-w-lg mx-auto right-0">
      
      {/* Level / XP */}
      <div className="flex flex-col w-1/3">
        <div className="flex items-center gap-1 text-sm font-bold text-stone-600">
           <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
             {state.level}
           </div>
           <span>Lvl</span>
        </div>
        <div className="w-full h-2 bg-stone-200 rounded-full mt-1 overflow-hidden">
          <div 
            className="h-full bg-blue-400 transition-all duration-500"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Weather Indicator (Center) */}
      <div className="flex flex-col items-center w-1/3">
         {state.weather === 'SUNNY' ? (
           <div className="flex flex-col items-center text-amber-500 animate-pulse">
             <CloudSun size={24} />
             <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mt-1">Słonecznie</span>
           </div>
         ) : (
           <div className="flex flex-col items-center text-blue-500 animate-pulse">
             <CloudRain size={24} />
             <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mt-1">Pada</span>
           </div>
         )}
      </div>

      {/* Coins */}
      <div className="flex items-center justify-end gap-2 w-1/3 font-mono font-bold text-amber-600 text-lg">
        <span>{Math.floor(state.coins)}</span>
        <Coins size={20} className="fill-amber-400" />
      </div>

    </div>
  );
};

export default TopBar;
