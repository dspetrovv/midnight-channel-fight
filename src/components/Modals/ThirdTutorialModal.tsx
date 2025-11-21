import React from 'react';
import { Zap, Shield, Skull } from 'lucide-react';

export const ThirdTutorialModal: React.FC = ({ closePage }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white/90 p-4 border-l-4 border-red-600">
                <h3 className="text-xl text-red-600 mb-2 flex items-center gap-2"><Zap size={20}/> 1 MORE SYSTEM</h3>
                <p className="text-sm md:text-base">
                    Attack an enemy's <strong>WEAKNESS</strong> or land a <strong>CRITICAL HIT</strong> to knock them down.
                    Knocking an enemy down grants you an extra turn ("1 More").
                </p>
            </div>

            <div className="bg-white/90 p-4 border-l-4 border-yellow-600">
                <h3 className="text-xl text-yellow-600 mb-2 flex items-center gap-2"><Skull size={20}/> ALL-OUT ATTACK</h3>
                <p className="text-sm md:text-base">
                    If <strong>ALL ENEMIES</strong> are knocked down, you can initiate an All-Out Attack for massive damage to everyone.
                </p>
            </div>

            <div className="bg-white/90 p-4 border-l-4 border-blue-600">
                <h3 className="text-xl text-blue-600 mb-2 flex items-center gap-2"><Shield size={20}/> GUARD</h3>
                <p className="text-sm md:text-base">
                    Guarding reduces damage by 50% and protects you from being knocked down by weaknesses or critical hits for one turn.
                </p>
            </div>
            <div>
                <button 
                    onClick={closePage} 
                    className="mx-auto p-4 bg-black text-white font-bold text-2md transform -skew-x-3 hover:scale-110 transition-transform cursor-pointer z-50 flex items-center gap-2"
                >
                    Close
                </button>
            </div>
        </div>
    );
};
