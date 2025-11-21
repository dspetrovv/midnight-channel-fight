
import React from 'react';
import { Swords, AlertTriangle } from 'lucide-react';

export const BattleStartBanner: React.FC = () => {
    return (
        <div className="absolute inset-0 z-[60] pointer-events-none flex flex-col justify-center items-center gap-4 overflow-hidden">
            {/* Background Slash */}
            <div className="absolute inset-0 bg-yellow-400 transform skew-y-3 scale-y-0 animate-scale-in opacity-90 origin-center"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-[140%] h-24 md:h-40 bg-black transform -skew-x-12 flex items-center justify-center animate-slide-in-left shadow-[0_0_30px_rgba(0,0,0,0.5)] border-y-4 md:border-y-8 border-red-600">
                     <div className="flex items-center gap-4">
                         <Swords className="w-12 h-12 md:w-24 md:h-24 text-yellow-400" />
                         <span className="font-display text-6xl md:text-5xl sm:text-4xl text-white italic tracking-tighter">IT'S SHOWTIME!</span>
                         <AlertTriangle className="w-10 h-10 md:w-20 md:h-20 text-red-600 animate-pulse" />
                     </div>
                </div>
                <div className="absolute top-full mt-4 bg-red-600 text-white font-display text-2xl md:text-4xl px-8 py-1 transform skew-x-12 animate-slide-in-right delay-100 border-2 border-black">
                    ENEMY ENCOUNTER
                </div>
            </div>
        </div>
    );
};
