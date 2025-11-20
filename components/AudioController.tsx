
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControllerProps {
    track: string;
}

export const AudioController: React.FC<AudioControllerProps> = ({ track }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            setHasInteracted(true);
            if (audioRef.current && audioRef.current.paused && !isMuted) {
                audioRef.current.play().catch(e => console.warn("Audio autoplay blocked", e));
            }
        };

        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [isMuted]);

    useEffect(() => {
        if (audioRef.current) {
            const playAudio = async () => {
                try {
                     if (!audioRef.current) return;
                     // Only reload if track changed or was paused
                     if (audioRef.current.src !== new URL(track, window.location.href).href) {
                        audioRef.current.pause();
                        audioRef.current.src = track;
                        audioRef.current.load();
                        if (hasInteracted && !isMuted) {
                            await audioRef.current.play();
                        }
                     }
                } catch (error) {
                    console.warn("Audio playback error:", error);
                }
            };
            playAudio();
        }
    }, [track, hasInteracted, isMuted]);
    
    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            if (!isMuted) {
                 if (hasInteracted && audioRef.current.paused) audioRef.current.play().catch(() => {});
            }
        }
    };

    return (
        <div className="absolute top-4 right-4 z-[100]">
             <audio ref={audioRef} loop />
             <button 
                onClick={toggleMute}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors"
             >
                 {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
             </button>
        </div>
    );
};
