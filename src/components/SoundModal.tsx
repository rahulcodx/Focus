'use client';

import { useState, useEffect, useRef } from 'react';

interface SoundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SoundEffect {
  id: string;
  name: string;
  icon: string;
  file: string;
}

export default function SoundModal({ isOpen, onClose }: SoundModalProps) {
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const soundEffects: SoundEffect[] = [
    {
      id: 'airplane',
      name: 'Airplane',
      icon: '✈️',
      file: '/sounds/airplane.wav'
    },
    {
      id: 'birds',
      name: 'Birds',
      icon: '🐦',
      file: '/sounds/birds.wav'
    },
    {
      id: 'campfire',
      name: 'Campfire',
      icon: '🔥',
      file: '/sounds/campfire.wav'
    },
    {
      id: 'clock',
      name: 'Clock',
      icon: '🕐',
      file: '/sounds/clock.wav'
    },
    {
      id: 'heavy-rain',
      name: 'Heavy Rain',
      icon: '⛈️',
      file: '/sounds/heavy rain.wav'
    },
    {
      id: 'keyboard',
      name: 'Keyboard',
      icon: '⌨️',
      file: '/sounds/keyboard.wav'
    },
    {
      id: 'light-rain',
      name: 'Light Rain',
      icon: '🌦️',
      file: '/sounds/light rain.wav'
    },
    {
      id: 'ocean',
      name: 'Ocean',
      icon: '🌊',
      file: '/sounds/ocean.wav'
    },
    {
      id: 'room',
      name: 'Room Ambience',
      icon: '🏠',
      file: '/sounds/room.wav'
    },
    {
      id: 'train',
      name: 'Train',
      icon: '🚂',
      file: '/sounds/train.wav'
    },
    {
      id: 'waterfall',
      name: 'Waterfall',
      icon: '💧',
      file: '/sounds/waterfall.wav'
    },
    {
      id: 'wind',
      name: 'Wind',
      icon: '💨',
      file: '/sounds/wind.wav'
    }
  ];

  const playSound = (soundId: string) => {
    // Stop current sound if playing
    stopCurrentSound();

    const soundEffect = soundEffects.find(s => s.id === soundId);
    if (soundEffect) {
      try {
        const audio = new Audio(soundEffect.file);
        audio.loop = true;
        audio.volume = 0.4; // Slightly lower volume for ambient sounds

        // Handle successful load and start playing
        audio.addEventListener('canplaythrough', () => {
          setCurrentSound(soundId);
          setIsPlaying(true);
        });

        audio.addEventListener('error', (error) => {
          console.error('Error loading sound:', soundEffect.file, error);
          setCurrentSound(null);
          setIsPlaying(false);
          // Show user-friendly error for missing files
          if (error.target && (error.target as HTMLAudioElement).error) {
            console.error('Audio error code:', (error.target as HTMLAudioElement).error?.code);
          }
        });

        audio.addEventListener('ended', () => {
          // This shouldn't happen with loop=true, but just in case
          console.log('Audio ended unexpectedly:', soundEffect.file);
        });

        audio.play().then(() => {
          currentAudioRef.current = audio;
        }).catch(error => {
          console.error('Error playing sound:', error);
          setCurrentSound(null);
          setIsPlaying(false);
        });
      } catch (error) {
        console.error('Error creating audio:', error);
        setIsPlaying(false);
      }
    }
  };

  const stopCurrentSound = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    setCurrentSound(null);
    setIsPlaying(false);
  };

  const toggleSound = (soundId: string) => {
    if (currentSound === soundId && isPlaying) {
      stopCurrentSound();
    } else {
      playSound(soundId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 left-6 z-40">
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }

        .sound-button {
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }

        .sound-button:hover {
          opacity: 0.8;
        }

        .sound-button.active {
          opacity: 1;
          background-color: rgba(255, 255, 255, 0.2);
        }

        button:focus {
          outline: none;
        }

        button:active {
          outline: none;
        }
      `}</style>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 w-80 max-h-[28rem] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-bold">Sound Effects</h3>
          <button
            onClick={onClose}
            className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer focus:outline-none"
            title="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Sound Effects Grid */}
        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          {soundEffects.map((sound) => (
            <button
              key={sound.id}
              onClick={() => toggleSound(sound.id)}
              className={`sound-button flex flex-col items-center gap-2 p-3 rounded-lg font-medium transition-all cursor-pointer bg-white/10 text-white focus:outline-none ${
                currentSound === sound.id && isPlaying
                  ? 'active'
                  : ''
              }`}
            >
              <span className="text-2xl">{sound.icon}</span>
              <span className="text-sm text-center">{sound.name}</span>
              {currentSound === sound.id && isPlaying && (
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Current Playing Indicator */}
        {currentSound && (
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-sm">Now Playing:</span>
              <span className="text-white font-medium">
                {soundEffects.find(s => s.id === currentSound)?.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
