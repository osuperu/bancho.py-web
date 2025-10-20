import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { BeatmapDetails } from '../../adapters/bpy-api/beatmaps';
import { useAudio } from '../../context/AudioContext';

interface BeatmapsetCardProps {
  beatmapset: BeatmapDetails;
  onSelect: (beatmapset: BeatmapDetails) => void;
}

const getDifficultyImage = (starRating: number): string => {
  if (starRating <= 1.99)
    return 'https://i.ppy.sh/e4046437c0d195a3f2bed4b4140a41d696bdf7f0/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f646966662f656173792d6f2e706e673f3230323131323135';
  if (starRating <= 2.69)
    return 'https://i.ppy.sh/20d7052354c61f8faf3a4828d9ff7751bb6776b1/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f646966662f6e6f726d616c2d6f2e706e673f3230323131323135';
  if (starRating <= 3.99)
    return 'https://i.ppy.sh/f6eabcfbacdfe85e520106702ec3a382a0430d40/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f646966662f696e73616e652d6f2e706e673f3230323131323135';
  if (starRating <= 5.29)
    return 'https://i.ppy.sh/f6eabcfbacdfe85e520106702ec3a382a0430d40/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f646966662f696e73616e652d6f2e706e673f3230323131323135';
  if (starRating <= 6.49)
    return 'https://i.ppy.sh/cd145e0f3cf7039d72cb7cfe58f3931585f8e7a7/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f646966662f6578706572742d6f2e706e673f3230323131323135';
  return 'https://i.ppy.sh/3b561ef8a73118940b59e79f3433bfa98c26cbf1/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f646966662f657870657274706c75732d6f2e706e673f3230323131323135';
};

export const BeatmapsetCard = ({ beatmapset }: BeatmapsetCardProps) => {
  const { t } = useTranslation();
  const { playAudio, isPlaying } = useAudio();
  const navigate = useNavigate();

  const isThisBeatmapPlaying = isPlaying(beatmapset.setId);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audioUrl = `${import.meta.env.PUBLIC_APP_BPY_MAPS_BASE_URL}/preview/${beatmapset.setId}.mp3`;
    playAudio(beatmapset.setId, audioUrl);
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
            <img
              key={difficulty.id}
              src={getDifficultyImage(difficulty.stars)}
              title={`${difficulty.name} - ${difficulty.stars}★`}
              alt={difficulty.name}
              style={{
                width: 20,
                height: 20,
                borderRadius: 2,
              }}
            />
          ))}
          {sortedDifficulties.length > 6 && (
            <Typography
              variant="caption"
              sx={{ color: '#FFFFFF80', alignSelf: 'center' }}
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
