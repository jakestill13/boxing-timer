'use client';

import { useEffect, useRef, useState } from 'react';

export interface AudioSystemProps {
  /** Whether to play the gong sound */
  shouldPlayGong: boolean;
  /** Whether to play the three beeps warning */
  shouldPlayBeeps: boolean;
  /** Audio volume from 0.0 to 1.0 */
  volume: number;
  /** Callback when audio playback starts */
  onAudioPlay?: (type: 'GONG' | 'BEEPS') => void;
  /** Callback when audio playback completes */
  onAudioComplete?: (type: 'GONG' | 'BEEPS') => void;
}

export default function AudioSystem({
  shouldPlayGong,
  shouldPlayBeeps,
  volume,
  onAudioPlay,
  onAudioComplete,
}: AudioSystemProps) {
  const gongAudioRef = useRef<HTMLAudioElement | null>(null);
  const beepsAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const lastPlayedGongRef = useRef<number>(0);
  const lastPlayedBeepsRef = useRef<number>(0);

  // Initialize audio elements
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Create audio elements
      gongAudioRef.current = new Audio('/audio/gong.mp3');
      beepsAudioRef.current = new Audio('/audio/beeps.mp3');

      // Set initial volume
      if (gongAudioRef.current) gongAudioRef.current.volume = volume;
      if (beepsAudioRef.current) beepsAudioRef.current.volume = volume;

      // Set up error handlers
      const handleAudioError = (type: string, error: Event) => {
        console.error(`Error loading ${type} audio:`, error);
        setAudioError(`Failed to load ${type} audio file`);
      };

      if (gongAudioRef.current) {
        gongAudioRef.current.addEventListener('error', (e) => handleAudioError('gong', e));
        gongAudioRef.current.addEventListener('ended', () => {
          if (onAudioComplete) onAudioComplete('GONG');
        });
      }

      if (beepsAudioRef.current) {
        beepsAudioRef.current.addEventListener('error', (e) => handleAudioError('beeps', e));
        beepsAudioRef.current.addEventListener('ended', () => {
          if (onAudioComplete) onAudioComplete('BEEPS');
        });
      }
    } catch (error) {
      console.error('Error initializing audio:', error);
      setAudioError('Failed to initialize audio system');
    }

    // Cleanup function
    return () => {
      if (gongAudioRef.current) {
        gongAudioRef.current.pause();
        gongAudioRef.current = null;
      }
      if (beepsAudioRef.current) {
        beepsAudioRef.current.pause();
        beepsAudioRef.current = null;
      }
    };
  }, [onAudioComplete, volume]);

  // Update volume when it changes
  useEffect(() => {
    if (gongAudioRef.current) gongAudioRef.current.volume = volume;
    if (beepsAudioRef.current) beepsAudioRef.current.volume = volume;
  }, [volume]);

  // Handle gong playback
  useEffect(() => {
    if (!shouldPlayGong || !gongAudioRef.current || !isAudioUnlocked) return;

    // Prevent playing the same gong multiple times in quick succession
    const now = Date.now();
    if (now - lastPlayedGongRef.current < 100) return;

    try {
      // Reset audio to start
      gongAudioRef.current.currentTime = 0;
      
      // Play the audio
      const playPromise = gongAudioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            lastPlayedGongRef.current = now;
            if (onAudioPlay) onAudioPlay('GONG');
          })
          .catch((error) => {
            console.error('Error playing gong audio:', error);
            // If audio fails to play, try to unlock audio context
            if (!isAudioUnlocked) {
              console.log('Audio context may be locked. User interaction required.');
            }
          });
      }
    } catch (error) {
      console.error('Error playing gong audio:', error);
    }
  }, [shouldPlayGong, isAudioUnlocked, onAudioPlay]);

  // Handle beeps playback
  useEffect(() => {
    if (!shouldPlayBeeps || !beepsAudioRef.current || !isAudioUnlocked) return;

    // Prevent playing the same beeps multiple times in quick succession
    const now = Date.now();
    if (now - lastPlayedBeepsRef.current < 100) return;

    try {
      // Reset audio to start
      beepsAudioRef.current.currentTime = 0;
      
      // Play the audio
      const playPromise = beepsAudioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            lastPlayedBeepsRef.current = now;
            if (onAudioPlay) onAudioPlay('BEEPS');
          })
          .catch((error) => {
            console.error('Error playing beeps audio:', error);
            // If audio fails to play, try to unlock audio context
            if (!isAudioUnlocked) {
              console.log('Audio context may be locked. User interaction required.');
            }
          });
      }
    } catch (error) {
      console.error('Error playing beeps audio:', error);
    }
  }, [shouldPlayBeeps, isAudioUnlocked, onAudioPlay]);

  // Function to unlock audio (must be called by user interaction)
  const unlockAudio = () => {
    if (isAudioUnlocked) return;

    try {
      // Create a silent audio context and play it
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set volume to 0
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      
      // Start and immediately stop to unlock audio
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.001);
      
      // Resume audio context (required for some browsers)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      setIsAudioUnlocked(true);
      setAudioError(null);
      console.log('Audio context unlocked');
    } catch (error) {
      console.error('Error unlocking audio:', error);
      setAudioError('Failed to unlock audio. Please try again.');
    }
  };

  // Render unlock button if audio is not unlocked
  if (!isAudioUnlocked) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={unlockAudio}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-xl shadow-lg transition-colors duration-200 min-h-[44px] min-w-[44px]"
          aria-label="Unlock audio for timer sounds"
        >
          🔊 Click to Enable Audio
        </button>
        {audioError && (
          <div className="mt-2 text-sm text-red-300 bg-red-900/50 p-2 rounded">
            {audioError}
          </div>
        )}
      </div>
    );
  }

  // AudioSystem is invisible when unlocked
  return null;
}
