
import React from 'react';
import { Flame, Snowflake, Zap, Wind, Heart, Cross, Sparkles, Star } from 'lucide-react';
import { Element } from '../types';

interface BattleEffectProps {
    type: string;
}

export const BattleEffect: React.FC<BattleEffectProps> = ({ type }) => {
    switch (type) {
        case Element.PHYS:
            return (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="w-32 md:w-64 h-2 bg-white animate-slash shadow-[0_0_20px_rgba(255,255,255,1)]"></div>
                    <div className="absolute w-32 md:w-64 h-1 bg-red-500 animate-slash delay-75 shadow-[0_0_20px_rgba(255,0,0,0.8)]"></div>
                </div>
            );
        case Element.FIRE:
            return (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="relative animate-burn">
                        <Flame className="w-16 h-16 md:w-[120px] md:h-[120px] text-red-500 fill-orange-400 drop-shadow-[0_0_15px_rgba(255,100,0,0.8)]" />
                        <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-50"></div>
                    </div>
                </div>
            );
        case Element.ICE:
            return (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="relative animate-freeze">
                        <Snowflake className="w-16 h-16 md:w-[120px] md:h-[120px] text-cyan-300 fill-white drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]" />
                         <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-30"></div>
                    </div>
                </div>
            );
        case Element.ELEC:
            return (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="relative animate-shock">
                        <Zap className="w-20 h-20 md:w-[140px] md:h-[140px] text-yellow-300 fill-white drop-shadow-[0_0_20px_rgba(255,255,0,1)]" />
                    </div>
                </div>
            );
        case Element.WIND:
            return (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="relative animate-whirlwind">
                        <Wind className="w-16 h-16 md:w-[120px] md:h-[120px] text-green-400 drop-shadow-[0_0_15px_rgba(0,255,100,0.8)]" />
                        <div className="absolute w-20 h-20 md:w-40 md:h-40 border-4 border-green-300 rounded-full opacity-50 border-dashed"></div>
                    </div>
                </div>
            );
        case 'HEAL':
        case 'REVIVE':
            return (
                 <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="relative animate-heal">
                        <Heart className="w-12 h-12 md:w-[80px] md:h-[80px] text-pink-500 fill-pink-200 drop-shadow-[0_0_10px_rgba(255,100,150,0.8)]" />
                        <div className="absolute -top-10 -right-10 animate-heal delay-100">
                             <Cross className="w-8 h-8 md:w-[40px] md:h-[40px] text-green-400 fill-green-200" />
                        </div>
                    </div>
                </div>
            );
         case 'SP':
            return (
                 <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="relative animate-heal">
                        <Sparkles className="w-12 h-12 md:w-[80px] md:h-[80px] text-purple-500 fill-purple-200 drop-shadow-[0_0_10px_rgba(200,100,255,0.8)]" />
                    </div>
                </div>
            );
        case 'CRITICAL':
            return (
                <div className="absolute inset-0 flex items-center justify-center z-[60] pointer-events-none">
                    <div className="relative animate-shake-hard z-50">
                        {/* Jagged backdrop */}
                        <div className="absolute inset-0 bg-black transform rotate-12 scale-150 opacity-70 clip-polygon-jagged"></div>
                        <span className="relative font-display text-3xl md:text-6xl text-yellow-300 italic drop-shadow-[4px_4px_0_rgba(0,0,0,1)] tracking-tighter transform -skew-x-12 border-black whitespace-nowrap">
                            CRITICAL!
                        </span>
                        <Star className="absolute -top-10 -left-10 w-12 h-12 text-white fill-yellow-200 animate-ping" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-32 h-32 bg-white/40 animate-ping rounded-full"></div>
                    </div>
                </div>
            );
        case 'MISS':
            return (
                <div className="absolute inset-0 flex items-center justify-center z-[60] pointer-events-none">
                    <div className="relative animate-float-up z-50">
                        <span className="font-display text-3xl md:text-5xl text-gray-400 italic drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-wider">
                            MISS
                        </span>
                    </div>
                </div>
            );
        default:
            return null;
    }
};
