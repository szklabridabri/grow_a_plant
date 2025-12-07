import React from 'react';
import { ToolType, PlantType, GameState } from '../types';
import { Sprout, Shovel, Droplets, ShoppingBasket, Hand } from 'lucide-react';
import { PLANT_DATA } from '../constants';

interface ControlPanelProps {
  selectedTool: ToolType;
  selectedSeed: PlantType;
  onSelectTool: (tool: ToolType) => void;
  onOpenShop: () => void;
  state: GameState;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  selectedTool, 
  selectedSeed, 
  onSelectTool, 
  onOpenShop,
  state 
}) => {
  
  const getToolStyle = (tool: ToolType) => {
    const isActive = selectedTool === tool;
    return `
      flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200
      ${isActive ? 'bg-green-100 text-green-700 -translate-y-2 shadow-lg scale-110' : 'text-stone-400 hover:text-stone-600'}
    `;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-2 pb-6 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-lg mx-auto flex justify-between items-end px-4">
        
        {/* Seeds (Opens modal if clicked twice or long pressed, simpler here: toggle mode) */}
        <button 
          onClick={() => selectedTool === ToolType.SEED_BAG ? onOpenShop() : onSelectTool(ToolType.SEED_BAG)} 
          className={getToolStyle(ToolType.SEED_BAG)}
        >
          <div className="relative">
             <Sprout size={28} />
             {selectedTool === ToolType.SEED_BAG && (
               <div className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] px-1 rounded-full animate-bounce">
                  {PLANT_DATA[selectedSeed].icon}
               </div>
             )}
          </div>
          <span className="text-[10px] font-bold mt-1 uppercase">Sadź</span>
        </button>

        {/* Water */}
        <button onClick={() => onSelectTool(ToolType.WATER)} className={getToolStyle(ToolType.WATER)}>
          <Droplets size={28} />
          <span className="text-[10px] font-bold mt-1 uppercase">Podlej</span>
        </button>

        {/* Harvest */}
        <button onClick={() => onSelectTool(ToolType.HARVEST)} className={getToolStyle(ToolType.HARVEST)}>
          <ShoppingBasket size={28} />
          <span className="text-[10px] font-bold mt-1 uppercase">Zbierz</span>
        </button>

        {/* Shovel */}
        <button onClick={() => onSelectTool(ToolType.SHOVEL)} className={getToolStyle(ToolType.SHOVEL)}>
          <Shovel size={28} />
          <span className="text-[10px] font-bold mt-1 uppercase">Usuń</span>
        </button>
        
        {/* Shop Button separate from tools */}
        <button 
           onClick={onOpenShop} 
           className="flex flex-col items-center justify-center p-2 text-amber-500 hover:text-amber-600 transition-transform active:scale-95"
        >
           <div className="bg-amber-100 p-3 rounded-full border border-amber-200 shadow-sm">
             <ShoppingBasket size={24} className="fill-amber-500" />
           </div>
           <span className="text-[10px] font-bold mt-1 uppercase">Sklep</span>
        </button>

      </div>
    </div>
  );
};

export default ControlPanel;
