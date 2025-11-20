
import React from 'react';

interface HealthBarProps {
    current: number;
    max: number;
    color?: string;
    label?: string;
}

export const HealthBar: React.FC<HealthBarProps> = ({ current, max, color = 'bg-green-500', label }) => {
    const percentage = Math.max(0, Math.min(100, (current / max) * 100));
    
    return (
        <div className="w-full">
            {label && <div className="text-[10px] md:text-xs font-bold uppercase mb-0.5 tracking-wider text-white text-shadow">{label}</div>}
            <div className="h-2 md:h-3 w-full bg-black/50 border border-white/30 p-0.5 transform -skew-x-12">
                <div 
                    className={`h-full ${color} transition-all duration-500 ease-out`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};
