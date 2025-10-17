import { Box, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { Difficulty } from '../../adapters/bpy-api/beatmaps';

export const BeatmapStat = ({
  difficulty,
}: {
  difficulty: Difficulty | null;
}) => {
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        background: '#191527',
      }}
    >
      <Typography variant="h6" sx={{ pb: 1 }}>
        {t('beatmap.beatmap_stats')}
      </Typography>

      <Stack spacing={1.5}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t('beatmap.star_rating')}:
          </Typography>
          <Typography variant="body2" color="white">
            {`${difficulty?.stars.toFixed(2) || 'N/A'} ★`}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t('beatmap.bpm')}:
          </Typography>
          <Typography variant="body2" color="white">
            {difficulty?.bpm || 'N/A'}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t('beatmap.creator')}:
          </Typography>
          <Typography variant="body2" color="white">
            {difficulty?.creator || 'N/A'}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t('beatmap.circles_capitalized')}:
          </Typography>
          <Typography variant="body2" color="white">
            {difficulty?.circleCount || 'N/A'}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t('beatmap.sliders_capitalized')}:
          </Typography>
          <Typography variant="body2" color="white">
            {difficulty?.sliderCount || 'N/A'}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t('beatmap.spinners_capitalized')}:
          </Typography>
          <Typography variant="body2" color="white">
            {difficulty?.spinnerCount || 'N/A'}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};
