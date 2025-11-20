
import React from 'react';
import { Eye, Triangle, Star } from 'lucide-react';

export const AllOutCutIn: React.FC = () => {
    return (
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-center items-center gap-4 overflow-hidden">
            <div className="w-[120%] h-20 md:h-32 bg-yellow-400 transform -skew-x-12 flex items-center justify-center animate-slide-in-left shadow-xl border-y-4 md:border-y-8 border-black">
                <Eye className="w-[60px] h-[60px] md:w-[120px] md:h-[120px] text-black animate-pulse" />
                <span className="font-display text-5xl md:text-9xl text-black ml-4 md:ml-8 italic">LET'S GO!</span>
            </div>
            <div className="w-[120%] h-16 md:h-24 bg-red-600 transform skew-x-12 flex items-center justify-center animate-slide-in-right delay-100 shadow-xl border-y-4 md:border-y-8 border-black">
                <span className="font-display text-3xl md:text-6xl text-white mr-4 md:mr-8 italic">BEAT 'EM UP!</span>
                <Triangle className="w-[40px] h-[40px] md:w-[80px] md:h-[80px] text-white fill-current animate-spin-slow" />
            </div>
             <div className="absolute bottom-10 right-10 font-display text-6xl md:text-8xl text-white drop-shadow-[4px_4px_0_#000] animate-bounce">
                !
            </div>
        </div>
    );
};

export const AllOutDustCloud: React.FC = () => {
    const clouds = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 60}%`,
        delay: Math.random() * 0.5,
        scale: 0.5 + Math.random() * 1.5,
        color: ['bg-gray-200', 'bg-white', 'bg-yellow-200'][Math.floor(Math.random() * 3)]
    }));

    return (
        <div className="absolute -inset-20 z-50 bg-black/30 animate-shake-hard overflow-hidden">
            {clouds.map(cloud => (
                <div 
                    key={cloud.id}
                    className={`absolute rounded-full opacity-0 animate-cloud ${cloud.color}`}
                    style={{
                        left: cloud.left,
                        top: cloud.top,
                        width: '100px',
                        height: '100px',
                        animationDelay: `${cloud.delay}s`,
                        transform: `scale(${cloud.scale})`
                    }}
                >
                     <div className="absolute inset-0 flex items-center justify-center">
                         <Star size={60} className="text-black animate-spin" />
                     </div>
                </div>
            ))}
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-6xl md:text-9xl text-red-600 italic rotate-12 drop-shadow-[5px_5px_0_#fff] animate-pulse">
                    BAM!
                </span>
            </div>
        </div>
    );
};

export const AllOutFinish: React.FC = () => {
    return (
        <div className="absolute inset-0 z-50 bg-yellow-400 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
             <div className="relative z-10 transform -rotate-6 text-center">
                 <h1 className="text-6xl md:text-[12rem] leading-none font-display text-black italic drop-shadow-[4px_4px_0px_rgba(255,255,255,1)] md:drop-shadow-[10px_10px_0px_rgba(255,255,255,1)] animate-scale-in">
                     FINISH!
                 </h1>
                 <div className="bg-black text-white text-xl md:text-4xl font-display px-4 py-1 md:px-8 md:py-2 inline-block transform skew-x-12 mt-4">
                     TOTAL DESTRUCTION
                 </div>
             </div>
             <div className="absolute bottom-0 right-0 w-1/2 h-full bg-black opacity-10 transform skew-x-12 translate-x-20"></div>
        </div>
    );
};
