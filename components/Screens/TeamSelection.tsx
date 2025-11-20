
import React from 'react';
import { HERO_ROSTER } from '../../constants';

interface TeamSelectionProps {
    partyIds: string[];
    onToggleMember: (id: string) => void;
    onConfirm: () => void;
}

export const TeamSelection: React.FC<TeamSelectionProps> = ({ partyIds, onToggleMember, onConfirm }) => {
    return (
        <div className="h-screen w-full bg-[#222] flex flex-col">
            <div className="absolute inset-0 tv-noise opacity-10 pointer-events-none"></div>
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-yellow-400 transform rotate-12 rounded-full blur-3xl opacity-20"></div>

            {/* Header */}
            <div className="shrink-0 p-4 md:p-8 z-10 flex flex-col items-center">
                <h1 className="text-4xl md:text-7xl font-display text-yellow-400 italic transform -skew-x-12 drop-shadow-[4px_4px_0_#000] shrink-0">
                    SELECT TEAM <span className="text-white text-2xl md:text-5xl ml-4">{partyIds.length}/3</span>
                </h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 flex flex-col items-center w-full max-w-6xl mx-auto z-10">
                {/* Grid - Scrollable */}
                <div className="flex-1 w-full overflow-y-auto p-4">
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {HERO_ROSTER.map(hero => {
                                const isSelected = partyIds.includes(hero.id);
                                const isLocked = hero.id === 'hero_1';

                                return (
                                    <div 
                                        key={hero.id}
                                        onClick={() => onToggleMember(hero.id)}
                                        className={`
                                            relative h-32 md:h-48 border-4 transform transition-all duration-200 cursor-pointer group overflow-hidden
                                            ${isSelected 
                                                ? 'border-yellow-400 bg-yellow-400/20 scale-105 shadow-[0_0_20px_rgba(250,204,21,0.4)]' 
                                                : 'border-gray-600 bg-black/40 hover:border-white grayscale hover:grayscale-0'
                                            }
                                            ${isLocked ? 'cursor-not-allowed' : ''}
                                        `}
                                    >
                                        {/* Background Color Strip */}
                                        <div className={`absolute inset-0 ${hero.imageColor} opacity-50 transform skew-x-12 translate-x-1/2`}></div>
                                        
                                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                            <span className="font-display text-3xl md:text-6xl text-white drop-shadow-lg uppercase">{hero.name.slice(0, 2)}</span>
                                            <span className="font-display text-lg md:text-2xl text-white mt-1 md:mt-2">{hero.name}</span>
                                        </div>
                                        
                                        {/* Avatar Image */}
                                        {hero.portrait && (
                                            <img 
                                                src={hero.portrait} 
                                                alt={hero.name}
                                                className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 mix-blend-overlay group-hover:opacity-100 group-hover:mix-blend-normal transition-all"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                                            />
                                        )}

                                        {isSelected && (
                                            <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-yellow-400 text-black font-bold text-xs md:text-base px-2 py-0.5 md:py-1 transform skew-x-12 z-20">
                                                {isLocked ? 'LEADER' : 'READY'}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                </div>

                {/* Footer - Fixed at bottom */}
                <div className="shrink-0 p-4 w-full flex justify-center bg-[#222]/90 backdrop-blur-sm border-t border-white/10">
                     <button 
                        onClick={onConfirm}
                        className="bg-white text-black font-display text-2xl md:text-4xl py-3 px-12 border-4 border-black hover:bg-yellow-400 hover:scale-105 transition-all transform -skew-x-12 shadow-[4px_4px_0_#000]"
                    >
                        CONFIRM
                    </button>
                </div>
            </div>
        </div>
    );
};
