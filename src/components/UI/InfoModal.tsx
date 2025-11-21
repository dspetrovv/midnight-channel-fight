import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with TV Noise */}
            <div 
                className="absolute inset-0 bg-black/80 tv-noise opacity-50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-yellow-400 w-full max-w-2xl transform -skew-x-3 border-4 border-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] animate-pop-in">
                {/* Decorative Strip */}
                <div className="absolute top-0 left-4 w-16 h-full bg-black/10 -skew-x-6 pointer-events-none"></div>

                {/* Header */}
                <div className="bg-black text-white px-6 py-2 flex justify-between items-center border-b-4 border-white">
                    <h2 className="font-display text-3xl md:text-4xl italic tracking-wider transform skew-x-3">{title}</h2>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="transform skew-x-3 font-sans font-bold text-black">
                        {children}
                    </div>
                </div>

                {/* Footer Decor */}
                <div className="absolute bottom-2 right-2 text-[10px] font-bold opacity-50">
                    // ANALYSIS
                </div>
            </div>
        </div>
    );
};