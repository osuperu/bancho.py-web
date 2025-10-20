import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { BeatmapDetails } from '../../adapters/bpy-api/beatmaps';
import { useAudio } from '../../context/AudioContext';
import { GameMode } from '../../GameModes';
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

export const BeatmapsetCard = ({ beatmapset }: BeatmapsetCardProps) => {
  const { t } = useTranslation();
  const { playAudio, isPlaying } = useAudio();
  const navigate = useNavigate();

  const isThisBeatmapPlaying = isPlaying(beatmapset.setId);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audioUrl = `${import.meta.env.PUBLIC_APP_BPY_MAPS_BASE_URL}/preview/${beatmapset.setId}.mp3`;
    playAudio(beatmapset.setId, audioUrl, {
      artist: beatmapset.artist,
      title: beatmapset.title,
    });
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(
      `${import.meta.env.PUBLIC_APP_BPY_OSU_BASE_URL}/d/${beatmapset?.setId}`,
    );
  };

  const handleCardClick = () => {
    if (beatmapset.difficulties.length > 0) {
      const firstDifficulty = beatmapset.difficulties[0];
      navigate(`/b/${firstDifficulty.id}`);
    }
  };

  const sortedDifficulties = [...beatmapset.difficulties].sort(
    (a, b) => a.stars - b.stars,
  );
  const backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${beatmapset.coverUrl})`;

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        color: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        minHeight: 160,
        backgroundImage: backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
          '& .card-content': {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        },
      }}
      onClick={handleCardClick}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${beatmapset.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(1px) saturate(150%)',
          zIndex: -1,
        }}
      />

      <Box
        className="card-content"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'background-color 0.2s ease',
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 0.5,
            }}
          >
            {beatmapset.artist} - {beatmapset.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#FFFFFF80',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {t('beatmapset.mapped_by')} {beatmapset.creator}
          </Typography>
        </Box>

        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {sortedDifficulties.slice(0, 6).map((difficulty) => (
            <Tooltip
              key={difficulty.id}
              title={`${difficulty.name} - ${difficulty.stars.toFixed(2)}★`}
              arrow
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Box
                  sx={{
                    color: getDifficultyColor(difficulty.stars),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getGameModeIcon(difficulty.gameMode)}
                </Box>
              </Box>
            </Tooltip>
          ))}
          {sortedDifficulties.length > 6 && (
            <Typography
              variant="caption"
              sx={{ color: '#FFFFFF80', alignSelf: 'center', fontSize: '10px' }}
            >
              +{sortedDifficulties.length - 6}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleDownloadClick}
            sx={{
              backgroundImage:
                'linear-gradient(90.09deg, #387EFC -0.08%, #C940FD 99.3%)',
              color: 'white',
              textTransform: 'none',
              borderRadius: 2,
              fontSize: '12px',
              padding: '4px 8px',
              minWidth: 0,
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            {t('beatmap.download')}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handlePlayClick}
            sx={{
              color: 'white',
              borderColor: isThisBeatmapPlaying
                ? '#FFBD3B'
                : 'rgba(255, 255, 255, 0.3)',
              textTransform: 'none',
              borderRadius: 2,
              fontSize: '12px',
              padding: '4px 8px',
              minWidth: 0,
              '&:hover': {
                borderColor: isThisBeatmapPlaying ? '#FFBD3B' : 'white',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            {isThisBeatmapPlaying ? t('beatmap.stop') : t('beatmap.play')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
