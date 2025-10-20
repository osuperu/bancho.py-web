import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type {
  BeatmapDetails,
  Difficulty,
} from '../../adapters/bpy-api/beatmaps';
import { formatTime } from '../../adapters/bpy-api/beatmaps';
import { useAudio } from '../../context/AudioContext';
import { GameMode } from '../../GameModes';
import { getRankedStatusString, type RankedStatus } from '../../RankedStatus';
import { BPMIcon } from '../images/beatmap/BPMIcon';
import { LengthIcon } from '../images/beatmap/LengthIcon';
import { PlayIcon } from '../images/beatmap/PlayIcon';
import { StarIcon } from '../images/beatmap/StarIcon';
import { StopIcon } from '../images/beatmap/StopIcon';
import { CatchGameModeIcon } from '../images/gamemode-icons/CatchGamemodeIcon';
import { ManiaGameModeIcon } from '../images/gamemode-icons/ManiaGamemodeIcon';
import { StandardGameModeIcon } from '../images/gamemode-icons/StandardGamemodeIcon';
import { TaikoGameModeIcon } from '../images/gamemode-icons/TaikoGamemodeIcon';

interface BeatmapHeaderProps {
  beatmap: BeatmapDetails | null;
  filteredDifficulties: Difficulty[];
  selectedDifficulty: Difficulty | null;
  setSelectedDifficulty: (diff: Difficulty) => void;
  gameMode: GameMode;
  onPlayPause?: () => void;
  isPlaying?: boolean;
}

export const BeatmapHeader = ({
  beatmap,
  filteredDifficulties,
  selectedDifficulty,
  setSelectedDifficulty,
  gameMode,
  onPlayPause,
}: BeatmapHeaderProps) => {
  const { t } = useTranslation();
  // ✅ Usar el hook de audio global
  const { playAudio, pauseAudio, isPlaying: isGlobalPlaying } = useAudio();

  const handlePlayClick = () => {
    if (!beatmap) return;

    // ✅ Usar el contexto global de audio
    const beatmapSetId = beatmap.setId;
    const isCurrentlyPlaying = isGlobalPlaying(beatmapSetId);

    if (isCurrentlyPlaying) {
      pauseAudio();
    } else {
      const audioUrl = `${import.meta.env.PUBLIC_APP_BPY_MAPS_BASE_URL}/preview/${beatmapSetId}.mp3`;
      playAudio(beatmapSetId, audioUrl);
    }

    // ✅ Llamar al callback del padre si existe
    if (onPlayPause) {
      onPlayPause();
    }
  };

  const getGameModeIcon = (mode: GameMode) => {
    switch (mode) {
      case GameMode.Standard:
        return <StandardGameModeIcon />;
      case GameMode.Taiko:
        return <TaikoGameModeIcon />;
      case GameMode.Catch:
        return <CatchGameModeIcon />;
      case GameMode.Mania:
        return <ManiaGameModeIcon />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (stars: number): string => {
    const domain = [0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9];
    const range = [
      '#4290FB',
      '#4FC0FF',
      '#4FFFD5',
      '#7CFF4F',
      '#F6F05C',
      '#FF8068',
      '#FF4E6F',
      '#C645B8',
      '#6563DE',
      '#18158E',
      '#000000',
    ];

    if (stars > 9) {
      return '#000000';
    }

    let index = 0;
    while (index < domain.length - 1 && stars >= domain[index]) {
      index++;
    }

    if (index === 0) {
      return range[0];
    } else if (index === domain.length) {
      return range[range.length - 1];
    } else {
      const prevValue = domain[index - 1];
      const nextValue = domain[index];
      const prevColor = range[index - 1];
      const nextColor = range[index];
      const proportion = (stars - prevValue) / (nextValue - prevValue);

      const prevRed = Number.parseInt(prevColor.substring(1, 3), 16);
      const prevGreen = Number.parseInt(prevColor.substring(3, 5), 16);
      const prevBlue = Number.parseInt(prevColor.substring(5, 7), 16);

      const nextRed = Number.parseInt(nextColor.substring(1, 3), 16);
      const nextGreen = Number.parseInt(nextColor.substring(3, 5), 16);
      const nextBlue = Number.parseInt(nextColor.substring(5, 7), 16);

      const red = Math.round(prevRed + (nextRed - prevRed) * proportion);
      const green = Math.round(
        prevGreen + (nextGreen - prevGreen) * proportion,
      );
      const blue = Math.round(prevBlue + (nextBlue - prevBlue) * proportion);

      return `#${red.toString(16).padStart(2, '0')}${green
        .toString(16)
        .padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
    }
  };

  const isConvertedDifficulty =
    selectedDifficulty?.gameMode === GameMode.Standard &&
    gameMode !== GameMode.Standard;

  // ✅ Determinar si este beatmap está reproduciéndose
  const isThisBeatmapPlaying = beatmap ? isGlobalPlaying(beatmap.setId) : false;

  return (
    <Container sx={{ px: { xs: 0, sm: 2 } }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: 520, md: 520, lg: 260 },
          background: `url(${beatmap?.coverUrl}) center/cover no-repeat`,
          borderRadius: 3,
          overflow: 'hidden',
          mb: 2,
          mt: { xs: 0, sm: 10, md: 10, lg: 10 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'column', lg: 'unset' },
          alignItems: { xs: 'center', md: 'center', lg: 'unset' },
          justifyContent: { xs: 'flex-start', md: 'flex-start', lg: 'unset' },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(21, 18, 35, 0.65)',
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            position: { xs: 'static', md: 'static', lg: 'absolute' },
            top: { lg: 16 },
            right: { lg: 24 },
            zIndex: 3,
            bgcolor: 'rgba(80,80,80,0.6)',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            alignSelf: { xs: 'flex-end', md: 'flex-end', lg: 'unset' },
            mt: { xs: 2, md: 2, lg: 0 },
            mr: { xs: '5%', md: '5%', lg: 0 },
          }}
        >
          <Typography variant="caption" color="white" fontWeight={700}>
            {getRankedStatusString(beatmap?.status as RankedStatus)}
          </Typography>
        </Box>

        <Box
          sx={{
            position: { xs: 'static', md: 'static', lg: 'absolute' },
            top: { lg: -38 },
            left: { lg: 0 },
            width: { xs: '90%', md: '90%', lg: '100%' },
            height: { xs: 50, md: 50, lg: 32 },
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pt: { xs: 2, md: 2, lg: 0 },
            mx: { xs: 'auto', md: 'auto', lg: 0 },
          }}
        >
          <Button
            onClick={handlePlayClick}
            sx={{
              width: '100%',
              height: '100%',
              minWidth: 0,
              borderRadius: 2,
              background: isThisBeatmapPlaying
                ? 'rgba(56,126,252,0.8)'
                : 'rgba(21,18,35,0.45)',
              color: 'white',
              boxShadow: 'none',
              p: 0,
              '&:hover': {
                background: 'rgba(56,126,252,0.8)',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease-in-out',
            }}
          >
            {isThisBeatmapPlaying ? <StopIcon /> : <PlayIcon />}
          </Button>
        </Box>

        <Box
          sx={{
            position: { xs: 'static', md: 'static', lg: 'absolute' },
            bottom: { lg: 24 },
            left: { lg: 24 },
            zIndex: 2,
            bgcolor: 'rgba(21,18,35,0.45)',
            borderRadius: 2,
            p: 2,
            minWidth: 180,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.25)',
            width: { xs: '90%', md: '90%', lg: 240 },
            mt: { xs: 2, md: 2, lg: 0 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -38,
              left: 0,
              width: '100%',
              height: 32,
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              onClick={handlePlayClick}
              sx={{
                width: '100%',
                height: '100%',
                minWidth: 0,
                borderRadius: 2,
                background: isThisBeatmapPlaying
                  ? 'rgba(56,126,252,0.8)'
                  : 'rgba(21,18,35,0.45)',
                color: 'white',
                boxShadow: 'none',
                p: 0,
                '&:hover': {
                  background: 'rgba(56,126,252,0.8)',
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease-in-out',
              }}
            >
              {isThisBeatmapPlaying ? <StopIcon /> : <PlayIcon />}
            </Button>
          </Box>
          <Stack spacing={0.5}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="white" fontWeight={500}>
                {t('beatmap.ar')}
              </Typography>
              <Typography variant="body2" color="white" fontWeight={700}>
                {selectedDifficulty?.ar ?? 'N/A'}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="white" fontWeight={500}>
                {t('beatmap.od')}
              </Typography>
              <Typography variant="body2" color="white" fontWeight={700}>
                {selectedDifficulty?.od ?? 'N/A'}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="white" fontWeight={500}>
                {t('beatmap.hp')}
              </Typography>
              <Typography variant="body2" color="white" fontWeight={700}>
                {selectedDifficulty?.hp ?? 'N/A'}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="white" fontWeight={500}>
                {t('beatmap.cs')}
              </Typography>
              <Typography variant="body2" color="white" fontWeight={700}>
                {selectedDifficulty?.cs ?? 'N/A'}
              </Typography>
            </Box>
          </Stack>
          <Box
            sx={{
              my: 1,
              height: 1,
              width: '100%',
              bgcolor: 'rgba(255,255,255,0.08)',
              borderRadius: 1,
            }}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box
                component="span"
                sx={{
                  fontSize: 18,
                  color: '#fff',
                  opacity: 0.8,
                }}
              >
                <LengthIcon />
              </Box>
              <Typography
                variant="body2"
                color="white"
                fontWeight={700}
                sx={{ pr: 1 }}
              >
                {formatTime(beatmap?.length)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box
                component="span"
                sx={{
                  fontSize: 18,
                  color: getDifficultyColor(selectedDifficulty?.stars ?? 0),
                }}
              >
                <StarIcon />
              </Box>
              <Typography
                variant="body2"
                color={getDifficultyColor(selectedDifficulty?.stars ?? 0)}
                fontWeight={700}
                sx={{ pr: 1 }}
              >
                {selectedDifficulty?.stars?.toFixed(2) ?? 'N/A'}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box
                component="span"
                sx={{
                  fontSize: 18,
                  color: '#fff',
                  opacity: 0.8,
                }}
              >
                <BPMIcon />
              </Box>
              <Typography variant="body2" color="white" fontWeight={700}>
                {beatmap?.difficulties[0]?.bpm ?? 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: { xs: 'static', md: 'static', lg: 'absolute' },
            bottom: { lg: 12 },
            left: { lg: '50%' },
            transform: { lg: 'translateX(-50%)' },
            zIndex: 2,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            maxHeight: 70,
            overflowY: 'auto',
            justifyContent: 'center',
            bgcolor: 'rgba(21,18,35,0.45)',
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.25)',
            borderRadius: 2,
            px: 2,
            py: 1,
            width: { xs: '90%', md: '90%', lg: 'auto' },
            mt: { xs: 2, md: 2, lg: 0 },
          }}
        >
          {filteredDifficulties
            .slice()
            .sort((a, b) => a.stars - b.stars)
            .map((diff) => (
              <Tooltip key={diff.id} title={diff.name}>
                <Chip
                  label={
                    <Box display="flex" alignItems="center">
                      <Box
                        mr={1}
                        display="flex"
                        alignItems="center"
                        sx={{
                          height: 22,
                          width: 22,
                          color: getDifficultyColor(diff.stars),
                        }}
                      >
                        {getGameModeIcon(diff.gameMode)}
                      </Box>
                      <span>{diff.name}</span>
                    </Box>
                  }
                  color={
                    diff.id === selectedDifficulty?.id ? 'primary' : 'default'
                  }
                  onClick={() => setSelectedDifficulty(diff)}
                  sx={{
                    bgcolor:
                      diff.id === selectedDifficulty?.id
                        ? 'rgba(56,126,252,0.9)'
                        : 'rgba(0,0,0,0.45)',
                    color: 'white',
                    fontWeight: 600,
                    px: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    border:
                      diff.id === selectedDifficulty?.id
                        ? '2px solid #FFBD3B'
                        : 'none',
                    boxShadow:
                      diff.id === selectedDifficulty?.id
                        ? '0 0 8px #FFBD3B'
                        : 'none',
                    '&:hover': {
                      opacity: 0.85,
                    },
                  }}
                />
              </Tooltip>
            ))}
        </Box>

        <Box
          sx={{
            position: { xs: 'static', md: 'static', lg: 'absolute' },
            top: { lg: 24 },
            left: { lg: '50%' },
            transform: { lg: 'translateX(-50%)' },
            zIndex: 2,
            textAlign: 'center',
            bgcolor: {
              xs: 'rgba(21,18,35,0.45)',
              md: 'rgba(21,18,35,0.45)',
              lg: 'unset',
            },
            borderRadius: { xs: 2, md: 2, lg: 0 },
            px: { xs: 2, md: 2, lg: 0 },
            py: { xs: 1, md: 1, lg: 0 },
            width: { xs: '90%', md: '90%', lg: 'auto' },
            mt: { xs: 2, md: 2, lg: 0 },
          }}
        >
          <Typography variant="h5" color="white" fontWeight={700}>
            {beatmap?.artist} - {beatmap?.title}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Typography variant="subtitle1" color="rgba(255,255,255,0.8)">
              {selectedDifficulty?.name}
            </Typography>
            {isConvertedDifficulty && (
              <Chip
                label={t('beatmap.converted')}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 189, 59, 0.2)',
                  color: '#FFBD3B',
                  height: '20px',
                  fontSize: '0.7rem',
                }}
              />
            )}
          </Box>
          <Typography variant="body2" color="rgba(255,255,255,0.6)">
            {t('beatmap.creator')}: {selectedDifficulty?.creator}
          </Typography>
        </Box>

        <Box
          sx={{
            position: { xs: 'static', md: 'static', lg: 'absolute' },
            bottom: { lg: 24 },
            right: { lg: 24 },
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mt: { xs: 2, md: 2, lg: 0 },
            pb: { xs: 2, md: 2, lg: 0 },
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              window.open(
                `${import.meta.env.PUBLIC_APP_BPY_OSU_BASE_URL}/d/${beatmap?.setId}`,
              )
            }
            sx={{
              backgroundImage:
                'linear-gradient(90.09deg, #387EFC -0.08%, #C940FD 99.3%)',
              color: 'white',
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
              px: 2,
              width: '100%',
              height: { xs: 32, md: 32, lg: 'auto' },
              minHeight: 32,
              '&:hover': { opacity: 0.9 },
            }}
          >
            {t('beatmap.download')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
