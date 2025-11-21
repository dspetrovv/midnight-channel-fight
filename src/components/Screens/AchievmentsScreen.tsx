
import React from 'react';
import { ACHIEVEMENTS } from '../../constants';
import { Tv, Zap, Skull, Heart, Users, Shield, Lock, Trophy, ArrowLeft } from 'lucide-react';

interface AchievementsScreenProps {
    unlockedIds: string[];
    onBack: () => void;
}

const iconMap: Record<string, React.FC<any>> = {
    Tv: Tv,
    Zap: Zap,
    Skull: Skull,
    Heart: Heart,
    Users: Users,
    Shield: Shield
};

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ unlockedIds, onBack }) => {
    return (
        <div className="h-screen w-full bg-yellow-400 relative overflow-hidden flex flex-col">
            {/* Visual Noise & Background */}
            <div className="absolute inset-0 tv-noise opacity-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-black/5 transform skew-x-12 pointer-events-none"></div>
            
            {/* Header */}
            <div className="shrink-0 p-4 md:p-8 z-10 flex flex-col items-start">
                <div className="bg-black text-white px-6 py-2 transform -skew-x-12 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-4xl md:text-6xl font-display italic tracking-wider flex items-center gap-4">
                        <Trophy className="text-yellow-400 w-8 h-8 md:w-12 md:h-12" />
                        ACHIEVEMENTS
                    </h1>
                </div>
                <p className="mt-2 font-display text-black text-xl transform -skew-x-12 bg-white px-2 border border-black">
                    TRACK YOUR PROGRESS
                </p>
            </div>

            {/* List Area */}
            <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 overflow-y-auto custom-scrollbar z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ACHIEVEMENTS.map(achievement => {
                        const isUnlocked = unlockedIds.includes(achievement.id);
                        const Icon = iconMap[achievement.icon] || Trophy;

                        return (
                            <div 
                                key={achievement.id}
                                className={`
                                    relative p-4 border-4 transition-all duration-300 transform hover:-translate-y-1
                                    ${isUnlocked 
                                        ? 'bg-black border-white text-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]' 
                                        : 'bg-gray-800/50 border-gray-600 text-gray-500 grayscale'
                                    }
                                `}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`
                                        p-3 border-2 transform rotate-3
                                        ${isUnlocked ? 'bg-yellow-400 border-white text-black' : 'bg-gray-700 border-gray-500 text-gray-400'}
                                    `}>
                                        {isUnlocked ? <Icon size={32} /> : <Lock size={32} />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-display text-2xl md:text-3xl italic ${isUnlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                                            {achievement.title}
                                        </h3>
                                        <p className="font-sans text-sm md:text-base mt-1 leading-tight">
                                            {achievement.description}
                                        </p>
                                        {!isUnlocked && (
                                            <div className="mt-2 text-xs font-bold bg-red-600 text-white px-2 py-0.5 inline-block transform -skew-x-12">
                                                LOCKED
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Decor */}
                                {isUnlocked && (
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer / Back */}
            <div className="shrink-0 p-4 md:p-8 flex justify-start z-20 bg-yellow-400 border-t-4 border-black">
                 <button 
                    onClick={onBack}
                    className="group flex items-center gap-2 bg-white text-black font-display text-2xl py-2 px-8 border-4 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_#000]"
                >
                    <ArrowLeft className="group-hover:-translate-x-1 transition-transform" /> BACK
                </button>
            </div>
        </div>
    );
};
