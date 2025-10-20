import {
  Alert,
  Box,
  Skeleton,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  fetchAllScores,
  type GetRecentScoresResponse,
} from '../../adapters/bpy-api/scores';
import { formatDecimal, formatNumber } from '../../utils/formatting';
import { getIndividualMods } from '../../utils/mods';
import { FlagIcon } from '../DestinationIcons';
import { ModIcon } from '../ModIcon';

const PLAY_ID_BG_COLOR = 'rgba(21, 18, 35, 1)';
const PLAY_INFO_BG_COLOR = 'rgba(30, 27, 47, 1)';

export const AdminRecentPlays = () => {
  const { t } = useTranslation();

  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scoresData, setScoresData] = useState<GetRecentScoresResponse>();

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const scoresResponse = await fetchAllScores({
          page: page + 1,
          limit: 5,
        });
        setScoresData(scoresResponse);
        setLoading(false);
        setError('');
      } catch (_e: any) {
        setError('Failed to fetch data from server');
        return;
      }
    })();
  }, [page]);

  if (loading || !scoresData) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={75}></Skeleton>
        ))}
      </>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" mb={2} color="white">
        {t('admin_panel.menu.recent_plays')}
      </Typography>
      <Box
        mb={1}
        display={{ xs: 'none', sm: 'grid' }}
        gridTemplateColumns="75px 1fr 140px 120px 120px 100px 120px"
        alignItems="center"
      >
        <Typography color="hsl(0deg 0% 100% / 60%)" align="center">
          {t('admin_panel.recent_plays.id')}
        </Typography>
        <Typography color="hsl(0deg 0% 100% / 60%)">
          {t('admin_panel.recent_plays.beatmap')}
        </Typography>
        <Typography color="hsl(0deg 0% 100% / 60%)" align="center">
          {t('admin_panel.recent_plays.player')}
        </Typography>
        <Typography color="hsl(0deg 0% 100% / 60%)" align="center">
          {t('admin_panel.recent_plays.score')}
        </Typography>
        <Typography color="hsl(0deg 0% 100% / 60%)" align="center">
          {t('admin_panel.recent_plays.accuracy')}
        </Typography>
        <Typography color="hsl(0deg 0% 100% / 60%)" align="center">
          {t('admin_panel.recent_plays.pp')}
        </Typography>
        <Typography color="hsl(0deg 0% 100% / 60%)" align="center">
          {t('admin_panel.recent_plays.mods')}
        </Typography>
      </Box>
      <Stack>
        {scoresData.scores.map((score) => (
          <Box
            key={score.id}
            display={{ xs: 'block', sm: 'grid' }}
            gridTemplateColumns="75px 1fr 140px 120px 120px 100px 120px"
            borderRadius={2}
            overflow="hidden"
            mb={1}
            bgcolor={PLAY_INFO_BG_COLOR}
            alignItems="center"
            sx={{ minHeight: { xs: 40, sm: 50 } }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor={PLAY_ID_BG_COLOR}
              minWidth="75px"
              p={1}
            >
              <Typography color="white">{score.id}</Typography>
            </Box>
            <Box
              flexGrow={1}
              p={1}
              display="flex"
              alignItems="center"
              minWidth={0}
            >
              <Link
                to={`/b/${score.beatmap.beatmapId}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  width: '100%',
                }}
              >
                <Tooltip
                  title={`${score.beatmap.artist} - ${score.beatmap.title} [${score.beatmap.version}]`}
                  arrow
                >
                  <Typography
                    color="white"
                    noWrap
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                      display: 'block',
                    }}
                  >
                    {score.beatmap.artist} - {score.beatmap.title} [
                    {score.beatmap.version}]
                  </Typography>
                </Tooltip>
              </Link>
            </Box>
            <Box
              minWidth="140px"
              p={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Link
                to={`/u/${score.user.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FlagIcon country={score.user.country} height={24} width={24} />
                <Typography color="white" ml={1} noWrap>
                  {score.user.username}
                </Typography>
              </Link>
            </Box>
            <Box
              minWidth="120px"
              p={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Tooltip title={formatNumber(score.score)}>
                <Typography color="white">
                  {formatNumber(score.score)}
                </Typography>
              </Tooltip>
            </Box>
            <Box
              minWidth="120px"
              p={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography color="white">
                {formatDecimal(score.accuracy)}%
              </Typography>
            </Box>
            <Box
              minWidth="100px"
              p={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography color="white">
                {score.pp ? score.pp.toFixed(2) : '-'}pp
              </Typography>
            </Box>
            <Box
              minWidth="120px"
              p={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box display="flex" gap={0.5} sx={{ flexWrap: 'wrap' }}>
                {getIndividualMods(score.mods).map((mod) => (
                  <ModIcon key={mod} variant={mod} width={32} height={20} />
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
      <TablePagination
        component="div"
        sx={{ color: 'hsl(0deg 0% 100% / 60%)' }}
        count={-1}
        rowsPerPage={5}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPageOptions={[]}
        labelRowsPerPage=""
        labelDisplayedRows={({ from, to }) => {
          return `Results ${from}-${to}`;
        }}
      />
    </Box>
  );
};
