
import React from 'react';
import { Swords, Sparkles, BriefcaseMedical, Shield } from 'lucide-react';
import { Unit } from '../../types';
import { SKILLS, ELEMENT_COLORS, ITEMS } from '../../constants';

interface BattleMenuProps {
    currentUnit: Unit;
    inventory: Record<string, number>;
    menuOpen: 'MAIN' | 'SKILL' | 'ITEM' | 'TARGET';
    setMenuOpen: (menu: 'MAIN' | 'SKILL' | 'ITEM' | 'TARGET') => void;
    onAttack: () => void;
    onSkill: (skillId: string) => void;
    onItem: (itemId: string) => void;
    onGuard: () => void;
    onAllOut: () => void;
    showAllOutBtn: boolean;
}

export const BattleMenu: React.FC<BattleMenuProps> = ({ 
    currentUnit, inventory, menuOpen, setMenuOpen, 
    onAttack, onSkill, onItem, onGuard, onAllOut, showAllOutBtn 
}) => {
    return (
        <div className={`
            absolute z-40
            portrait:top-24 portrait:right-4 
            landscape:bottom-16 landscape:left-4
            md:bottom-20 md:left-20
        `}>
            <div className="relative">
                <div className="absolute -inset-10 border-[20px] md:border-[40px] border-yellow-400/20 rounded-full animate-spin-slow pointer-events-none"></div>
                
                {menuOpen === 'MAIN' ? (
                    <div className={`
                        flex flex-col gap-1 md:gap-2 transform -skew-x-6 scale-90 md:scale-100
                        portrait:items-end portrait:origin-top-right
                        landscape:items-start landscape:origin-bottom-left
                        animate-slide-up-fade
                    `}>
                        {showAllOutBtn && (
                            <button onClick={onAllOut} className="group relative w-60 md:w-72 bg-red-600 text-white font-display text-3xl md:text-5xl italic py-2 px-4 md:py-4 md:px-8 shadow-[4px_4px_0px_0px_#000] md:shadow-[8px_8px_0px_0px_#000] hover:translate-x-4 transition-all animate-pulse z-50 mb-2 md:mb-4 border-2 md:border-4 border-black hover:bg-white hover:text-red-600">
                                <span className="relative z-10 flex items-center gap-2">ALL-OUT!</span>
                                <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left -z-1"></div>
                            </button>
                        )}
                        <button 
                            onClick={onAttack} 
                            disabled={showAllOutBtn}
                            className={`
                                w-36 md:w-48 bg-black text-white font-display text-xl md:text-2xl py-1 px-4 md:py-2 md:px-6 border-l-4 md:border-l-8 transition-all
                                ${showAllOutBtn 
                                    ? 'border-gray-600 opacity-30 grayscale cursor-not-allowed' 
                                    : 'border-yellow-400 hover:bg-yellow-400 hover:text-black hover:border-black'
                                }
                            `}
                        >
                            <span className="flex items-center gap-2"><Swords className="w-4 h-4 md:w-5 md:h-5"/> ATTACK</span>
                        </button>
                        <button 
                            onClick={() => setMenuOpen('SKILL')} 
                            disabled={showAllOutBtn}
                            className={`
                                w-36 md:w-48 bg-black text-white font-display text-xl md:text-2xl py-1 px-4 md:py-2 md:px-6 border-l-4 md:border-l-8 transition-all
                                ${showAllOutBtn 
                                    ? 'border-gray-600 opacity-30 grayscale cursor-not-allowed' 
                                    : 'border-blue-400 hover:bg-blue-400 hover:text-black hover:border-black'
                                }
                            `}
                        >
                            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 md:w-5 md:h-5"/> SKILL</span>
                        </button>
                        <button 
                            onClick={() => setMenuOpen('ITEM')} 
                            disabled={showAllOutBtn}
                            className={`
                                w-36 md:w-48 bg-black text-white font-display text-xl md:text-2xl py-1 px-4 md:py-2 md:px-6 border-l-4 md:border-l-8 transition-all
                                ${showAllOutBtn 
                                    ? 'border-gray-600 opacity-30 grayscale cursor-not-allowed' 
                                    : 'border-green-400 hover:bg-green-400 hover:text-black hover:border-black'
                                }
                            `}
                        >
                            <span className="flex items-center gap-2"><BriefcaseMedical className="w-4 h-4 md:w-5 md:h-5"/> ITEM</span>
                        </button>
                        <button 
                            onClick={onGuard} 
                            disabled={showAllOutBtn}
                            className={`
                                w-36 md:w-48 bg-black text-white font-display text-xl md:text-2xl py-1 px-4 md:py-2 md:px-6 border-l-4 md:border-l-8 transition-all
                                ${showAllOutBtn 
                                    ? 'border-gray-600 opacity-30 grayscale cursor-not-allowed' 
                                    : 'border-gray-400 hover:bg-gray-400 hover:text-black hover:border-black'
                                }
                            `}
                        >
                            <span className="flex items-center gap-2"><Shield className="w-4 h-4 md:w-5 md:h-5"/> GUARD</span>
                        </button>
                    </div>
                ) : menuOpen === 'SKILL' ? (
                    <div className={`
                        bg-black/90 p-2 md:p-4 border-2 border-white max-h-40 md:max-h-64 overflow-y-auto min-w-[200px] md:min-w-[250px]
                        portrait:origin-top-right landscape:origin-bottom-left
                    `}>
                        <div className="text-yellow-400 font-bold mb-2 border-b border-gray-600 pb-1 flex justify-between text-sm md:text-base">
                            <span>SELECT SKILL</span>
                            <button onClick={() => setMenuOpen('MAIN')} className="text-[10px] text-white bg-gray-700 px-1">BACK</button>
                        </div>
                        {currentUnit.skills.map(skill => (
                            <button 
                                key={skill.id}
                                disabled={currentUnit.sp < skill.cost}
                                onClick={() => onSkill(skill.id)}
                                className={`
                                    w-full text-left py-1 md:py-2 px-2 mb-1 flex justify-between items-center font-display tracking-wider text-sm md:text-base
                                    hover:bg-white/20 transition-colors
                                    ${currentUnit.sp < skill.cost ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <span className={ELEMENT_COLORS[skill.element] || 'text-white'}>
                                    {skill.name}
                                </span>
                                <span className="text-[10px] md:text-xs text-gray-400">{skill.cost} SP</span>
                            </button>
                        ))}
                    </div>
                ) : (
                        /* ITEM MENU */
                        <div className={`
                        bg-black/90 p-2 md:p-4 border-2 border-white max-h-40 md:max-h-64 overflow-y-auto min-w-[200px] md:min-w-[250px]
                        portrait:origin-top-right landscape:origin-bottom-left
                        `}>
                        <div className="text-green-400 font-bold mb-2 border-b border-gray-600 pb-1 flex justify-between text-sm md:text-base">
                            <span>SELECT ITEM</span>
                            <button onClick={() => setMenuOpen('MAIN')} className="text-[10px] text-white bg-gray-700 px-1">BACK</button>
                        </div>
                        {Object.values(ITEMS).map(item => (
                            <button 
                                key={item.id}
                                disabled={!inventory[item.id]}
                                onClick={() => onItem(item.id)}
                                className={`
                                    w-full text-left py-1 md:py-2 px-2 mb-1 flex justify-between items-center font-display tracking-wider text-sm md:text-base
                                    hover:bg-white/20 transition-colors
                                    ${!inventory[item.id] ? 'opacity-30 cursor-not-allowed' : ''}
                                `}
                            >
                                <div className="flex flex-col">
                                    <span className="text-white">{item.name}</span>
                                    <span className="text-[8px] md:text-[10px] text-gray-400 truncate max-w-[120px]">{item.description}</span>
                                </div>
                                <span className="text-lg md:text-xl font-bold text-yellow-300">x{inventory[item.id] || 0}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
