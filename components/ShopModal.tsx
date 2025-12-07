import React, { useState } from 'react';
import { PlantType, GameState, Decoration } from '../types';
import { PLANT_DATA, AVAILABLE_DECORATIONS } from '../constants';
import { X, Lock } from 'lucide-react';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onBuySeed: (type: PlantType) => void;
  onBuyDecoration: (id: string) => void;
  onEquipDecoration: (id: string) => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ 
  isOpen, onClose, state, onBuySeed, onBuyDecoration, onEquipDecoration 
}) => {
  const [tab, setTab] = useState<'SEEDS' | 'DECOR'>('SEEDS');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h2 className="text-xl font-bold text-stone-700">Sklep Ogrodniczy</h2>
          <button onClick={onClose} className="p-1 hover:bg-stone-200 rounded-full transition-colors">
            <X size={24} className="text-stone-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-100">
          <button 
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${tab === 'SEEDS' ? 'border-b-2 border-green-500 text-green-600 bg-green-50/50' : 'text-stone-400'}`}
            onClick={() => setTab('SEEDS')}
          >
            Nasiona
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${tab === 'DECOR' ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50/50' : 'text-stone-400'}`}
            onClick={() => setTab('DECOR')}
          >
            Dekoracje
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3 bg-stone-50/30">
          
          {tab === 'SEEDS' && Object.values(PLANT_DATA).filter(p => p.id !== 'empty').map((plant) => {
            const isLocked = state.level < plant.levelReq;
            const isSelected = state.selectedSeed === plant.id.toUpperCase() as PlantType;

            return (
              <button
                key={plant.id}
                onClick={() => {
                   if(!isLocked) {
                     onBuySeed(plant.id.toUpperCase() as PlantType);
                     onClose();
                   }
                }}
                disabled={isLocked}
                className={`
                   w-full flex items-center p-3 rounded-xl border-2 transition-all
                   ${isSelected ? 'border-green-500 bg-green-50 ring-1 ring-green-300' : 'border-stone-200 bg-white hover:border-stone-300'}
                   ${isLocked ? 'opacity-60 grayscale' : ''}
                `}
              >
                <div className="text-4xl mr-4">{plant.icon}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                     <h3 className="font-bold text-stone-800">{plant.name}</h3>
                     {isLocked && <Lock size={12} className="text-stone-400" />}
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-1">{plant.description}</p>
                  <div className="flex gap-3 mt-1 text-xs">
                    <span className="text-amber-600 font-mono font-bold">Koszt: {plant.cost}</span>
                    <span className="text-blue-600">Zysk: {plant.sellPrice}</span>
                  </div>
                </div>
                {isLocked ? (
                   <div className="text-xs font-bold text-red-400 bg-red-50 px-2 py-1 rounded">Lvl {plant.levelReq}</div>
                ) : (
                   <div className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Wybierz</div>
                )}
              </button>
            );
          })}

          {tab === 'DECOR' && AVAILABLE_DECORATIONS.map((decor) => {
             const owned = state.decorations.some(d => d.id === decor.id && d.purchased);
             const active = state.decorations.some(d => d.id === decor.id && d.active);

             return (
               <div key={decor.id} className="w-full flex items-center p-3 rounded-xl border border-stone-200 bg-white">
                  <div className="text-4xl mr-4">{decor.icon}</div>
                  <div className="flex-1 text-left">
                     <h3 className="font-bold text-stone-800">{decor.name}</h3>
                     <p className="text-xs text-purple-500 font-medium">{decor.effect}</p>
                     <p className="text-xs text-amber-600 font-mono mt-1">
                        {owned ? 'Zakupiono' : `Cena: ${decor.cost}`}
                     </p>
                  </div>
                  {owned ? (
                     <button 
                       onClick={() => onEquipDecoration(decor.id)}
                       className={`px-3 py-1 rounded-full text-xs font-bold ${active ? 'bg-purple-500 text-white' : 'bg-stone-200 text-stone-600'}`}
                     >
                        {active ? 'Używasz' : 'Użyj'}
                     </button>
                  ) : (
                     <button
                        onClick={() => onBuyDecoration(decor.id)}
                        disabled={state.coins < decor.cost}
                        className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold disabled:opacity-50"
                     >
                        Kup
                     </button>
                  )}
               </div>
             )
          })}
        </div>
      </div>
    </div>
  );
};

export default ShopModal;
