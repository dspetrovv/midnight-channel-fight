
import React from 'react';
import { Unit } from '../types';
import { BattleEffect } from './BattleEffect';
import { HealthBar } from './HealthBar';
import { Shield } from 'lucide-react';

interface UnitProps {
    unit: Unit;
    isActive: boolean;
    isTargeting: boolean;
    onClick: () => void;
    activeEffect?: string | null;
}

export const UnitCard: React.FC<UnitProps> = ({ unit, isActive, isTargeting, onClick, activeEffect }) => {
    return (
        <div 
            onClick={isTargeting ? onClick : undefined}
            className={`
                relative p-2 md:p-4 transition-all duration-300
                w-24 md:w-32 lg:w-40
                ${isActive ? 'scale-105 md:scale-110 z-10' : 'scale-100 opacity-90'}
                ${isTargeting ? 'animate-pulse ring-2 md:ring-4 ring-blue-500 ring-offset-2 ring-offset-black cursor-pointer' : ''}
                ${unit.hp <= 0 ? 'grayscale opacity-60' : ''}
                ${unit.isDown && unit.hp > 0 ? 'brightness-75' : ''}
            `}
        >
            {/* Effect Overlay */}
            {activeEffect && <BattleEffect type={activeEffect} />}

            {/* Portrait Frame */}
            <div className={`
                relative w-full ${unit.imageColor} border-2 md:border-4 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                overflow-hidden transform -skew-x-6 group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform
                h-24 md:h-32
            `}>
                {/* Placeholder for char image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-2xl md:text-4xl text-black/20 uppercase">{unit.name.slice(0, 2)}</span>
                </div>
                
                {/* Image Avatar */}
                {unit.portrait && (
                    <img 
                        src={unit.portrait} 
                        alt={unit.name} 
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                    />
                )}
                
                {/* Status Icons */}
                <div className="absolute top-0 right-0 p-1 flex flex-col gap-1 z-20">
                    {unit.hp <= 0 && <span className="bg-purple-900 text-white text-[8px] md:text-[10px] px-1 font-bold">DEAD</span>}
                    {unit.isDown && unit.hp > 0 && <span className="bg-red-600 text-white text-[8px] md:text-[10px] px-1 font-bold animate-bounce">DOWN</span>}
                    {unit.isDefending && (
                        <div className="bg-gray-500 text-white p-0.5 rounded-full border border-white animate-pulse shadow-lg">
                            <Shield className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                    )}
                    <div className="flex flex-wrap gap-0.5 justify-end">
                        {unit.weaknesses.map(w => (
                            <div key={w} className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-black/20 border border-white/50" title={`Weak: ${w}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-2 md:mt-4 space-y-1 transform -skew-x-6">
                <HealthBar current={unit.hp} max={unit.maxHp} color="bg-yellow-400" />
                <HealthBar current={unit.sp} max={unit.maxSp} color="bg-purple-400" />
            </div>
            
            {isActive && (
                <div className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 text-yellow-300 animate-bounce">
                    <div className="transform rotate-90 text-xl md:text-3xl">➤</div>
                </div>
            )}
             {isTargeting && (
                 <div className="absolute inset-0 border-2 md:border-4 border-blue-400 animate-pulse opacity-50 pointer-events-none"></div>
            )}
        </div>
    );
};
