
import React from 'react';
import { Unit } from '../types';
import { BattleEffect } from './BattleEffect';
import { Skull, Shield } from 'lucide-react';

interface EnemyUnitProps {
    unit: Unit;
    isActive: boolean;
    isTargeting: boolean;
    onClick: () => void;
    activeEffect?: string | null;
    isEntering?: boolean;
}

export const EnemyUnit: React.FC<EnemyUnitProps> = ({ unit, isActive, isTargeting, onClick, activeEffect, isEntering }) => {
    return (
        <div 
            className={`
                relative flex flex-col items-center transition-all duration-300
                ${unit.hp <= 0 ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100'}
                ${isTargeting ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]' : ''}
                pointer-events-none
            `}
        >
            {/* Effect Overlay */}
            {activeEffect && <BattleEffect type={activeEffect} />}

            <div 
                onClick={onClick}
                className={`
                    relative w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48 ${unit.imageColor} 
                    mask-blob animate-float
                    ${unit.isDown ? 'rotate-90 translate-y-4 md:translate-y-8' : ''}
                    ${isTargeting ? 'cursor-pointer' : ''}
                    ${isEntering ? 'animate-spawn-blob opacity-0' : ''}
                    pointer-events-auto
                `}
            >
                {/* Shadow Effect (Visual noise) */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-50 mix-blend-overlay"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Skull className="w-8 h-8 md:w-16 md:h-16 text-black/50" />
                </div>

                {/* Enemy Avatar */}
                {unit.portrait && (
                    <img 
                        src={unit.portrait} 
                        alt={unit.name} 
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                    />
                )}

                {/* Shield Icon for Defending Enemies */}
                {unit.isDefending && (
                    <div className="absolute top-0 left-0 bg-gray-700 p-1 rounded-full border-2 border-white animate-pulse z-30">
                         <Shield className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                )}
            </div>
            
            {/* Floating Health Bar */}
            <div 
                onClick={onClick}
                className={`
                    absolute -bottom-2 md:-bottom-4 w-20 md:w-32 transform skew-x-12 border md:border-2 border-black bg-black
                    pointer-events-auto
                    ${isTargeting ? 'cursor-pointer' : ''}
                    ${isEntering ? 'animate-spawn-blob opacity-0' : ''}
                `}
            >
                <div className="h-1.5 md:h-2 bg-red-600" style={{ width: `${(unit.hp / unit.maxHp) * 100}%` }}></div>
            </div>

            {/* Target Indicator */}
            {isTargeting && (
                 <div className="absolute inset-0 border-2 md:border-4 border-red-500 rounded-full animate-ping opacity-50 pointer-events-none"></div>
            )}
            
            {/* Status Badge for Enemies */}
            {unit.isDown && unit.hp > 0 && (
                <div className="absolute top-0 right-0 md:-right-2 bg-red-600 text-white text-[10px] md:text-xs px-1 md:px-2 py-0.5 font-bold animate-bounce z-20 transform skew-x-12 border border-white shadow-lg pointer-events-none">
                    DOWN
                </div>
            )}
            
            {/* Weakness Hit Indicator - Floating Text (ONLY FOR WEAKNESS) */}
            {unit.isDown && unit.downAttribute === 'WEAK' && (
                <div className="absolute -top-6 md:-top-10 font-display text-xl md:text-4xl text-yellow-400 italic text-shadow-black animate-bounce opacity-50 pointer-events-none">
                    WEAK!
                </div>
            )}
            
            {isActive && (
                <div className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 text-red-500 animate-bounce z-20 pointer-events-none">
                    <div className="transform rotate-90 text-2xl md:text-4xl drop-shadow-lg">➤</div>
                </div>
            )}
        </div>
    );
};
