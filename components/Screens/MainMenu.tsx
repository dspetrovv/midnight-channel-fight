
import React from 'react';
import { Play, Users } from 'lucide-react';

interface MainMenuProps {
    onPlay: () => void;
    onTeam: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onPlay, onTeam }) => {
    return (
        <div className="h-screen w-full bg-yellow-400 relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 tv-noise opacity-20 pointer-events-none"></div>
            
            {/* Decorative Stripes */}
            <div className="absolute top-0 left-1/4 w-32 h-full bg-black/10 transform -skew-x-12"></div>
            <div className="absolute top-0 right-1/4 w-16 h-full bg-black/5 transform skew-x-12"></div>

            <div className="z-10 flex flex-col items-center gap-8">
                <div className="text-6xl md:text-9xl font-display font-black italic text-black tracking-tighter transform -rotate-6 drop-shadow-lg mb-8">
                    MIDNIGHT<br/><span className="text-white text-stroke-black">CHANNEL</span>
                </div>

                <div className="flex flex-col gap-4 items-center w-full max-w-md">
                    <button 
                        onClick={onPlay}
                        className="group relative w-64 bg-black text-white font-display text-3xl italic py-4 px-8 transform -skew-x-12 hover:scale-110 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:bg-white hover:text-black border-4 border-black"
                    >
                        <div className="flex items-center justify-center gap-2 transform skew-x-12">
                            <Play className="fill-current" /> PLAY
                        </div>
                    </button>
                    
                    <button 
                        onClick={onTeam}
                        className="group relative w-64 bg-black text-white font-display text-3xl italic py-4 px-8 transform -skew-x-12 hover:scale-110 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:bg-white hover:text-black border-4 border-black"
                    >
                         <div className="flex items-center justify-center gap-2 transform skew-x-12">
                            <Users className="fill-current" /> TEAM
                        </div>
                    </button>
                </div>
            </div>
            
            <div className="absolute bottom-4 right-4 font-display text-black text-xl opacity-50">
                © 2024 INABA NET
            </div>
        </div>
    );
};
