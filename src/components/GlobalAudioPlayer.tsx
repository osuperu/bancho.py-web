import {
  Close,
  Pause,
  PlayArrow,
  VolumeDown,
  VolumeUp,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { useAudio } from '../context/AudioContext';

export const GlobalAudioPlayer = () => {
  const {
    currentPlaying,
    playerVisible,
    playbackState,
    playAudio,
    pauseAudio,
    closePlayer,
    volume,
    setVolume,
    currentTime,
    duration,
    seekTo,
  } = useAudio();

  if (!playerVisible || currentPlaying === null) return null;

  const formatTime = (seconds: number) => {
    if (Number.isNaN(seconds) || !Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  const handleSeekChange = (_event: Event, newValue: number | number[]) => {
    seekTo(newValue as number);
  };

  const handleTogglePlay = () => {
    if (currentPlaying) {
      if (playbackState === 'playing') {
        pauseAudio();
      } else {
        const audioUrl = `${import.meta.env.PUBLIC_APP_BPY_MAPS_BASE_URL}/preview/${currentPlaying}.mp3`;
        playAudio(currentPlaying, audioUrl);
      }
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: '90%',
        maxWidth: 300,
        p: 2,
        pl: 1,
        backgroundColor: 'background.paper',
        zIndex: 1000,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            size="small"
            onClick={closePlayer}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
          <IconButton
            size="medium"
            onClick={handleTogglePlay}
            color="primary"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            {playbackState === 'playing' ? <Pause /> : <PlayArrow />}
          </IconButton>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ minWidth: 25 }}
              >
                {formatTime(currentTime)}
              </Typography>
              <Slider
                size="small"
                value={currentTime}
                max={duration || 0}
                onChange={handleSeekChange}
                sx={{ flex: 1 }}
                disabled={!duration}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ minWidth: 25 }}
              >
                {formatTime(duration)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VolumeDown sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Slider
                size="small"
                value={volume}
                max={1}
                step={0.01}
                onChange={handleVolumeChange}
                sx={{ flex: 1 }}
              />
              <VolumeUp sx={{ color: 'text.secondary', fontSize: 20 }} />
            </Box>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
};
