import React from 'react';
import { Sword, Swords, Sparkles } from 'lucide-react';
import { ELEMENT_COLORS } from '@/src/constants';

export const FirstTutorialModal: React.FC = ({ nextPage }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white/90 p-4 border-l-4 border-red-600">
                <h3 className="text-xl text-red-600 mb-2 flex items-center gap-2"><Sword size={20}/> BATTLE SYSTEM</h3>
                <p className="text-sm md:text-base">
                    You can attack your opponent with a normal <Swords size={17} className="inline-block" /> attack or use a <Sparkles size={17} className="inline-block" /> skill.
                    Each enemy and character has its own <strong>WEAKNESSES</strong> and <strong>RESISTANCES</strong>.
                    Hitting a weak spot causes additional damage. A normal attack can deal <strong>CRITICAL</strong> damage.
                </p>
            </div>

            <div className="bg-white/90 p-4 border-l-4 border-yellow-600">
                <h3 className="text-xl text-yellow-600 mb-2 flex items-center gap-2"><Sparkles size={20}/> SKILLS</h3>
                <p className="text-sm md:text-base">
                    You can use skills on your opponents. Damage type can be determined by the color of the skill name:&nbsp;
                    <span class={ELEMENT_COLORS.Fire}>fire</span>, <span class={ELEMENT_COLORS.Ice}>ice</span>,&nbsp;
                    <span class={ELEMENT_COLORS.Elec}>lightning</span>, <span class={ELEMENT_COLORS.Wind}>wind</span>.
                    Weakness to one damage type often means resistance to another:&nbsp;
                    <span class={ELEMENT_COLORS.Fire}>fire</span> - <span class={ELEMENT_COLORS.Ice}>ice</span>,&nbsp;
                    <span class={ELEMENT_COLORS.Elec}>lightning</span> - <span class={ELEMENT_COLORS.Wind}>wind</span>.
                    Massive skills starts with "ma-" or "me-" (ex. Maziodyne, Media).
                    Each skill costs SP. The number of SP is indicated on the purple stripe under the character.
                </p>
            </div>

            <div>
                <button 
                    onClick={nextPage} 
                    className="mx-auto p-4 bg-black text-white font-bold text-2md transform -skew-x-3 hover:scale-110 transition-transform cursor-pointer z-50 flex items-center gap-2"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
