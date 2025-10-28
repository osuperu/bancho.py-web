import { Box, Button, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type {
  BeatmapDetails,
  Difficulty,
} from '../../adapters/bpy-api/beatmaps';
import { useAudio } from '../../context/AudioContext';
import { GameMode } from '../../GameModes';
import { PlayIcon } from '../images/beatmap/PlayIcon';
import { StopIcon } from '../images/beatmap/StopIcon';
import { CatchGameModeIcon } from '../images/gamemode-icons/CatchGamemodeIcon';
import { ManiaGameModeIcon } from '../images/gamemode-icons/ManiaGamemodeIcon';
import { StandardGameModeIcon } from '../images/gamemode-icons/StandardGamemodeIcon';
import { TaikoGameModeIcon } from '../images/gamemode-icons/TaikoGamemodeIcon';

interface BeatmapsetCardProps {
  beatmapset: BeatmapDetails;
  onSelect: (beatmapset: BeatmapDetails) => void;
}

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
    const green = Math.round(prevGreen + (nextGreen - prevGreen) * proportion);
    const blue = Math.round(prevBlue + (nextBlue - prevBlue) * proportion);

    return `#${red.toString(16).padStart(2, '0')}${green
      .toString(16)
      .padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
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

export const BeatmapsetCard = ({
  beatmapset,
  onSelect,
}: BeatmapsetCardProps) => {
  const { t } = useTranslation();
  const { playAudio, isPlaying, pauseAudio } = useAudio();

  const isThisBeatmapPlaying = isPlaying(beatmapset.setId);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audioUrl = `${import.meta.env.PUBLIC_APP_BPY_MAPS_BASE_URL}/preview/${beatmapset.setId}.mp3`;
    if (isThisBeatmapPlaying) {
      pauseAudio();
    } else {
      playAudio(beatmapset.setId, audioUrl, {
        artist: beatmapset.artist,
        title: beatmapset.title,
      });
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(
      `${import.meta.env.PUBLIC_APP_BPY_OSU_BASE_URL}/d/${beatmapset?.setId}`,
    );
  };

  const handleCardClick = () => {
    onSelect(beatmapset);
  };

  const sortedDifficulties = [...beatmapset.difficulties].sort(
    (a, b) => a.stars - b.stars,
  );

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        color: 'white',
        minHeight: 140,
        background: `url(${beatmapset.coverUrl}) center/cover no-repeat`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        mb: 1,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          transform: 'translateY(-2px) scale(1.01)',
        },
      }}
      onClick={handleCardClick}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(21, 18, 35, 0.65)',
          zIndex: 1,
        }}
      />
      <Stack
        spacing={0.5}
        sx={{
          position: 'relative',
          zIndex: 2,
          p: 1.5,
          pb: 1.5,
          width: '100%',
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            textShadow: '0 2px 8px #000a',
            fontSize: '1.1rem',
            mt: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            maxWidth: '100%',
            display: 'block',
          }}
          title={`${beatmapset.artist} - ${beatmapset.title}`}
        >
          {beatmapset.artist} - {beatmapset.title}
        </Typography>
        <Typography
          variant="body2"
          color="rgba(255,255,255,0.7)"
          sx={{ mt: 0 }}
        >
          {t('beatmapset.mapped_by')} {beatmapset.creator}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            maxHeight: 36,
            overflowY: 'auto',
          }}
        >
          {sortedDifficulties.slice(0, 8).map((diff: Difficulty) => (
            <Tooltip key={diff.id} title={diff.name}>
              <Chip
                label={
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                      height: 18,
                      width: 18,
                      color: getDifficultyColor(diff.stars),
                    }}
                  >
                    {getGameModeIcon(diff.gameMode)}
                  </Box>
                }
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  minWidth: 28,
                  boxShadow: 'none',
                  '&:hover': {
                    opacity: 0.85,
                  },
                }}
              />
            </Tooltip>
          ))}
          {sortedDifficulties.length > 8 && (
            <Typography
              variant="caption"
              sx={{ color: '#FFFFFF80', alignSelf: 'center', fontSize: '10px' }}
            >
              +{sortedDifficulties.length - 8}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1} sx={{ mt: 0 }}>
          <Button
            variant="contained"
            onClick={handleDownloadClick}
            sx={{
              backgroundImage:
                'linear-gradient(90.09deg, #387EFC -0.08%, #C940FD 99.3%)',
              color: 'white',
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
              px: 2,
              minWidth: 0,
              height: 32,
              fontSize: '0.95rem',
              '&:hover': { opacity: 0.9 },
            }}
          >
            {t('beatmap.download')}
          </Button>
          <Button
            variant="outlined"
            onClick={handlePlayClick}
            sx={{
              color: 'white',
              borderColor: isThisBeatmapPlaying
                ? '#FFBD3B'
                : 'rgba(255, 255, 255, 0.3)',
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
              px: 2,
              minWidth: 0,
              height: 32,
              fontSize: '0.95rem',
              '&:hover': {
                borderColor: isThisBeatmapPlaying ? '#FFBD3B' : 'white',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            {isThisBeatmapPlaying ? (
              <Box sx={{ mr: 1, display: 'inline-flex' }}>
                <StopIcon />
              </Box>
            ) : (
              <Box sx={{ mr: 1, display: 'inline-flex' }}>
                <PlayIcon />
              </Box>
            )}
            {isThisBeatmapPlaying ? t('beatmap.stop') : t('beatmap.play')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
