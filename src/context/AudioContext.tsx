// context/AudioContext.tsx
import type React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  currentPlaying: number | null;
  playAudio: (setId: number, audioUrl: string) => void;
  stopAudio: () => void;
  closePlayer: () => void;
  isPlaying: (setId: number) => boolean;
  volume: number;
  setVolume: (volume: number) => void;
  currentTime: number;
  duration: number;
  seekTo: (time: number) => void;
  playerVisible: boolean;
  playbackState: 'playing' | 'paused' | 'stopped'; // ✅ Nuevo estado de reproducción
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const [volume, setVolumeState] = useState<number>(0.5);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playerVisible, setPlayerVisible] = useState<boolean>(false);
  const [playbackState, setPlaybackState] = useState<
    'playing' | 'paused' | 'stopped'
  >('stopped'); // ✅ Nuevo estado
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Actualizar volumen cuando cambie
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Actualizar tiempo actual
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  };

  const playAudio = (setId: number, audioUrl: string) => {
    // Si ya está reproduciendo este mismo, pausarlo
    if (currentPlaying === setId && audioRef.current) {
      if (playbackState === 'playing') {
        audioRef.current.pause();
        setPlaybackState('paused');
      } else {
        audioRef.current.play();
        setPlaybackState('playing');
      }
      return;
    }

    // Pausar audio actual si hay uno reproduciéndose
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Reproducir nuevo audio
    audioRef.current = new Audio(audioUrl);
    audioRef.current.volume = volume;
    setCurrentPlaying(setId);
    setPlayerVisible(true);
    setPlaybackState('playing'); // ✅ Estado a playing

    audioRef.current.play();

    audioRef.current.onended = () => {
      setPlaybackState('stopped'); // ✅ Estado a stopped cuando termina
      setCurrentTime(0);
    };

    audioRef.current.onpause = () => {
      if (currentPlaying === setId) {
        setPlaybackState('paused'); // ✅ Estado a paused cuando se pausa
      }
    };
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaybackState('stopped'); // ✅ Estado a stopped
      setCurrentTime(0);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentPlaying(null);
    setCurrentTime(0);
    setDuration(0);
    setPlayerVisible(false);
    setPlaybackState('stopped'); // ✅ Resetear estado
  };

  const isPlaying = (setId: number) =>
    currentPlaying === setId && playbackState === 'playing';

  return (
    <AudioContext.Provider
      value={{
        currentPlaying,
        playAudio,
        stopAudio,
        closePlayer,
        isPlaying,
        volume,
        setVolume,
        currentTime,
        duration,
        seekTo,
        playerVisible,
        playbackState, // ✅ Exportar el estado de reproducción
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
