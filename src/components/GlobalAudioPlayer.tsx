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
    stopAudio,
    closePlayer,
    volume,
    setVolume,
    currentTime,
    duration,
    seekTo,
  } = useAudio();

  if (!playerVisible) return null;

  const formatTime = (seconds: number) => {
    if (Number.isNaN(seconds)) return '0:00';
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
        stopAudio();
      } else {
        const audioUrl = `${import.meta.env.PUBLIC_APP_BPY_MAPS_BASE_URL}/preview/${currentPlaying}.mp3`;
        playAudio(currentPlaying, audioUrl);
      }
    }
  };

  const canPlay = currentPlaying !== null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: '90%',
        maxWidth: 400,
        p: 2,
        backgroundColor: 'background.paper',
        zIndex: 1000,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={2}>
        {/* progress bar */}
        {duration > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ minWidth: 40 }}
            >
              {formatTime(currentTime)}
            </Typography>
            <Slider
              size="small"
              value={currentTime}
              max={duration || 0}
              onChange={handleSeekChange}
              sx={{ flex: 1 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ minWidth: 40 }}
            >
              {formatTime(duration)}
            </Typography>
            {/* volume bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: 120 }}>
              <VolumeDown
                sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }}
              />
              <Slider
                size="small"
                value={volume}
                max={1}
                step={0.01}
                onChange={handleVolumeChange}
                sx={{ flex: 1 }}
              />
              <VolumeUp sx={{ color: 'text.secondary', ml: 1, fontSize: 20 }} />
            </Box>
            {/* buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="medium"
                onClick={handleTogglePlay}
                color={playbackState === 'playing' ? 'primary' : 'default'}
                disabled={!canPlay} // ✅ Solo deshabilitar si no hay canción cargada
                sx={{
                  backgroundColor:
                    playbackState === 'playing'
                      ? 'primary.main'
                      : 'action.selected',
                  color: 'white',
                  '&:hover': {
                    backgroundColor:
                      playbackState === 'playing'
                        ? 'primary.dark'
                        : 'action.hover',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'action.disabledBackground',
                    color: 'action.disabled',
                  },
                }}
              >
                {playbackState === 'playing' ? <Pause /> : <PlayArrow />}
              </IconButton>
            </Box>
            <Box>
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
            </Box>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
