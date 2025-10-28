import type React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  currentPlaying: number | null;
  currentBeatmapInfo: { artist: string; title: string } | null;
  playAudio: (
    setId: number,
    audioUrl: string,
    beatmapInfo?: { artist: string; title: string },
  ) => void;
  pauseAudio: () => void;
  stopAudio: () => void;
  closePlayer: () => void;
  isPlaying: (setId: number) => boolean;
  volume: number;
  setVolume: (volume: number) => void;
  currentTime: number;
  duration: number;
  seekTo: (time: number) => void;
  playerVisible: boolean;
  playbackState: 'playing' | 'paused' | 'stopped';
  currentAudioUrl: string | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const [currentBeatmapInfo, setCurrentBeatmapInfo] = useState<{
    artist: string;
    title: string;
  } | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [volume, setVolumeState] = useState<number>(0.5);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playerVisible, setPlayerVisible] = useState<boolean>(false);
  const [playbackState, setPlaybackState] = useState<
    'playing' | 'paused' | 'stopped'
  >('stopped');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setPlaybackState('stopped');
      setCurrentTime(0);
    };
    const handlePause = () => {
      if (playbackState === 'playing' && !audio.ended) {
        setPlaybackState('paused');
      }
    };
    const handlePlay = () => {
      setPlaybackState('playing');
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, [playbackState, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  };

  const playAudio = async (
    setId: number,
    audioUrl: string,
    beatmapInfo?: { artist: string; title: string },
  ) => {
    if (!audioRef.current) return;

    if (currentPlaying === setId && currentAudioUrl === audioUrl) {
      if (playbackState === 'playing') {
        pauseAudio();
      } else {
        await audioRef.current.play();
        setPlaybackState('playing');
      }
      return;
    }

    if (audioRef.current.src && currentAudioUrl !== audioUrl) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    audioRef.current.src = audioUrl;
    audioRef.current.volume = volume;

    setCurrentPlaying(setId);
    setCurrentAudioUrl(audioUrl);
    setCurrentBeatmapInfo(beatmapInfo || null);
    setPlayerVisible(true);
    setCurrentTime(0);

    try {
      await audioRef.current.play();
      setPlaybackState('playing');
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlaybackState('paused');
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && playbackState === 'playing') {
      audioRef.current.pause();
      setPlaybackState('paused');
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaybackState('stopped');
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
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    setCurrentPlaying(null);
    setCurrentBeatmapInfo(null);
    setCurrentAudioUrl(null);
    setCurrentTime(0);
    setDuration(0);
    setPlayerVisible(false);
    setPlaybackState('stopped');
  };

  const isPlaying = (setId: number) =>
    currentPlaying === setId && playbackState === 'playing';

  return (
    <AudioContext.Provider
      value={{
        currentPlaying,
        currentBeatmapInfo,
        currentAudioUrl,
        playAudio,
        pauseAudio,
        stopAudio,
        closePlayer,
        isPlaying,
        volume,
        setVolume,
        currentTime,
        duration,
        seekTo,
        playerVisible,
        playbackState,
      }}
    >
      {children}
      {/** biome-ignore lint/a11y/useMediaCaption: <No caption needed> */}
      <audio ref={audioRef} style={{ display: 'none' }} />
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
