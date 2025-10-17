import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

import type { UserStats } from '../../adapters/bpy-api/user';
import {
  getGradeColor,
  remapSSForDisplay as getGradeDisplayName,
} from '../../scores';
import { formatNumber, formatTimespan } from '../../utils/formatting';

const GradeCountDisplay = ({
  grade,
  count,
}: {
  grade: string;
  count: number;
}) => {
  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="h5" color={getGradeColor(grade)}>
        {getGradeDisplayName(grade)}
      </Typography>
      <Typography variant="h5">{formatNumber(count)}</Typography>
    </Stack>
  );
};

const ProfileGradesCard = ({ statsData }: { statsData: UserStats }) => {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1}>
      <GradeCountDisplay grade="XH" count={statsData.grades.XHCount} />
      <GradeCountDisplay grade="SH" count={statsData.grades.SHCount} />
      <GradeCountDisplay grade="X" count={statsData.grades.XCount} />
      <GradeCountDisplay grade="S" count={statsData.grades.SCount} />
      <GradeCountDisplay grade="A" count={statsData.grades.ACount} />
    </Stack>
  );
};

const StatDisplay = ({ name, value }: { name: string; value: string }) => {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body1">{name}</Typography>
      <Typography variant="body1" textAlign="end">
        {value}
      </Typography>
    </Stack>
  );
};

export const ProfileStatsCard = ({ statsData }: { statsData: UserStats }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Stack direction="column" spacing={1}>
        <StatDisplay
          name={t('profile.stats.ranked_score')}
          value={formatNumber(statsData.rankedScore)}
        />
        <StatDisplay
          name={t('profile.stats.total_score')}
          value={formatNumber(statsData.totalScore)}
        />
        <StatDisplay
          name={t('profile.stats.playcount')}
          value={formatNumber(statsData.playcount)}
        />
        <StatDisplay
          name={t('profile.stats.playtime')}
          value={
            formatTimespan(statsData.playtime, 2) ||
            t('profile.stats.never_played')
          }
        />
        <StatDisplay
          name={t('profile.stats.replays_watched')}
          value={formatNumber(statsData.replaysWatched)}
        />
        <StatDisplay
          name={t('profile.stats.total_hits')}
          value={formatNumber(statsData.totalHits)}
        />
        <StatDisplay
          name={t('profile.stats.max_combo')}
          value={formatNumber(statsData.maxCombo)}
        />
        <ProfileGradesCard statsData={statsData} />
      </Stack>
    </Box>
  );
};
