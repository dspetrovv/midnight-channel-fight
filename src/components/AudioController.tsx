import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControllerProps {
    track: string;
}

export const AudioController: React.FC<AudioControllerProps> = ({ track }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const fadeIntervalRef = useRef<number | null>(null);

    // Handle user interaction to unlock audio
    useEffect(() => {
        const handleInteraction = () => {
            setHasInteracted(true);
            // Try to resume if we have a track and not muted
            if (audioRef.current && audioRef.current.paused && !isMuted && audioRef.current.src) {
                fadeIn();
            }
        };

        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [isMuted]);

    const clearFade = () => {
        if (fadeIntervalRef.current) {
            window.clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
    };

    const fadeIn = () => {
        if (!audioRef.current) return;
        clearFade();
        
        const audio = audioRef.current;
        audio.volume = 0;
        audio.play().catch(e => console.warn("Autoplay blocked", e));

        let vol = 0;
        fadeIntervalRef.current = window.setInterval(() => {
            if (vol < 0.35) { // Target max volume 1.0 (ish)
                vol += 0.05;
                audio.volume = Math.min(1, vol);
            } else {
                audio.volume = 0.4;
                clearFade();
            }
        }, 50); // 50ms * 20 steps = 1 sec fade
    };

    const fadeOutAndSwitch = (newTrack: string) => {
        if (!audioRef.current) return;
        clearFade();

        const audio = audioRef.current;
        let vol = audio.volume;

        // If not playing or volume already 0, just switch instantly
        if (audio.paused || vol <= 0) {
             audio.src = newTrack;
             audio.load();
             if (hasInteracted && !isMuted) fadeIn();
             return;
        }

        fadeIntervalRef.current = window.setInterval(() => {
            if (vol > 0.05) {
                vol -= 0.05;
                audio.volume = Math.max(0, vol);
            } else {
                // Fade out complete
                audio.volume = 0;
                audio.pause();
                clearFade();
                
                // Switch track
                audio.src = newTrack;
                audio.load();
                if (hasInteracted && !isMuted) {
                    fadeIn();
                }
            }
        }, 50); // 50ms steps
    };

    // Watch for track changes
    useEffect(() => {
        if (audioRef.current) {
            // Use absolute URL for comparison to avoid reloading same track
            const currentSrc = audioRef.current.src;
            const newSrc = new URL(track, window.location.href).href;

            if (currentSrc !== newSrc) {
                // Initial load (no src yet)
                if (!currentSrc || currentSrc === window.location.href) {
                    audioRef.current.src = track;
                    if (hasInteracted && !isMuted) fadeIn();
                } else {
                    // Transition
                    fadeOutAndSwitch(track);
                }
            }
        }
    }, [track, hasInteracted, isMuted]);

    // Handle mute toggle
    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (audioRef.current) {
            if (isMuted) {
                // Unmuting
                audioRef.current.muted = false;
                if (hasInteracted && audioRef.current.paused) fadeIn();
            } else {
                // Muting
                audioRef.current.muted = true;
                // No need to fade out, mute is instant system-level usually, 
                // but we can just set muted property.
            }
        }
    };

    return (
        <div className="absolute top-4 right-4 z-[100]">
             <audio ref={audioRef} loop />
             {/* <button 
                onClick={toggleMute}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors"
             >
                 {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
             </button> */}
        </div>
    );
};