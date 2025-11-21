import React from 'react';
import { Heart, BriefcaseMedical, Sparkles } from 'lucide-react';
import { ELEMENT_COLORS } from '@/src/constants';

export const SecondTutorialModal: React.FC = ({ nextPage }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white/90 p-4 border-l-4 border-red-600">
                <h3 className="text-xl text-red-600 mb-2 flex items-center gap-2"><Heart size={20}/> HEALING</h3>
                <p className="text-sm md:text-base">
                    The heailng system is based on the use of <Sparkles size={17} class="inline-block" /> skills and&nbsp;
                    <BriefcaseMedical size={17} class="inline-block" /> items. Treatment skills are also can be determined by the&nbsp;
                    <span class={ELEMENT_COLORS.Heal}>color</span>.
                    Items can restore not only hp, but also sp, and revive an ally if it is knocked down.
                    The number of HP is indicated on the yellow stripe under the character.
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
