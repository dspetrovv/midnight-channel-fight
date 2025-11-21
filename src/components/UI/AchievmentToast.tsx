import React from 'react';
import { ACHIEVEMENTS } from '../../constants';
import { Trophy } from 'lucide-react';

interface AchievementToastProps {
    achievementId: string;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievementId }) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return null;

    return (
        <div className="animate-slide-in-right bg-black border-2 border-white text-white p-2 md:p-3 flex items-center gap-3 shadow-[4px_4px_0_rgba(255,204,21,1)] transform -skew-x-6 max-w-xs">
            <div className="bg-yellow-400 text-black p-2 transform skew-x-6 border border-black">
                <Trophy size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Achievement Unlocked</div>
                <div className="font-display text-lg leading-none truncate">{achievement.title}</div>
            </div>
        </div>
    );
};