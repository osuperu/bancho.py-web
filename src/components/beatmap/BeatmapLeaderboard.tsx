import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Button,
  GridLegacy,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type React from 'react';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type { LeaderboardDetails } from '../../adapters/bpy-api/beatmaps';
import { getFlagUrl } from '../../utils/countries';
import { getIndividualMods } from '../../utils/mods';
import { ModIcon } from '../ModIcon';

interface Difficulty {
  id: number;
  name: string;
}

const DownloadReplayMenuItem = ({
  score,
  handleMenuClose,
}: {
  score: LeaderboardDetails;
  handleMenuClose: () => void;
}) => {
  const { t } = useTranslation();

  const handleDownloadClick = () => {
    handleMenuClose();
  };

  return (
    <MenuItem
      key="download-replay"
      component={Link}
      to={`${process.env.PUBLIC_APP_BPY_API_BASE_URL}/v1/get_replay?id=${score.id}`}
      onClick={handleDownloadClick}
    >
      <Typography color="white">{t('leaderboard.download_replay')}</Typography>
    </MenuItem>
  );
};

const ViewScoreMenuItem = ({
  score,
  handleMenuClose,
}: {
  score: LeaderboardDetails;
  handleMenuClose: () => void;
}) => {
  const { t } = useTranslation();

  const handleViewClick = () => {
    handleMenuClose();
  };

  return (
    <MenuItem
      key="view-score"
      component={Link}
      to={`/scores/${score.id}`}
      onClick={handleViewClick}
    >
      <Typography color="white">{t('leaderboard.view_score')}</Typography>
    </MenuItem>
  );
};

const ScoreOptionsMenu = ({ score }: { score: LeaderboardDetails }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id={useId()}
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        onMouseDown={(e) => e.stopPropagation()}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          zIndex: 2,
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id={useId()}
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          zIndex: 9999,
          '& .MuiPaper-root': {
            backgroundColor: '#191527',
            color: 'white',
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <DownloadReplayMenuItem score={score} handleMenuClose={handleClose} />
        <ViewScoreMenuItem score={score} handleMenuClose={handleClose} />
      </Menu>
    </>
  );
};

const USER_RANK_BG_COLOR = 'rgba(21, 18, 35, 1)';
const USER_INFO_BG_COLOR = 'rgba(30, 27, 47, 1)';

export const BeatmapLeaderboard = ({
  leaderboard,
  isLoadingLeaderboard,
  leaderboardError,
  selectedDifficulty,
  showAllScores,
  toggleScoresView,
}: {
  leaderboard: LeaderboardDetails[] | null;
  isLoadingLeaderboard: boolean;
  leaderboardError: string | null;
  selectedDifficulty: Difficulty | null;
  showAllScores: boolean;
  toggleScoresView: () => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const displayedScores = leaderboard
    ? showAllScores
      ? leaderboard
      : leaderboard.slice(0, 20)
    : [];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        borderRadius: 2,
        background: '#191527',
        maxHeight: '800px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={3}
        pt={2}
      >
        <Typography variant="h6">
          {t('beatmap.top_scores')}{' '}
          {leaderboard
            ? `(${showAllScores ? leaderboard.length : Math.min(20, leaderboard.length)})`
            : ''}
        </Typography>
        {leaderboard && leaderboard.length > 20 && (
          <Button
            variant="text"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'none',
              fontSize: 16,
              '&:hover': {
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            onClick={toggleScoresView}
          >
            {showAllScores
              ? t('beatmap.show_top_20')
              : t('beatmap.view_all_scores')}
          </Button>
        )}
      </Stack>
      <Box
        sx={{
          overflowY: 'auto',
          overflowX: 'auto',
          flex: 1,
          px: { xs: 1, sm: 3 },
          pb: 2,
        }}
      >
        <Box sx={!isMobile ? { width: '100%' } : {}}>
          {!isMobile && <LeaderboardTableHeader t={t} />}
          {!selectedDifficulty ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography color="white">
                {t('beatmap.no_diffs_available')}
              </Typography>
            </Box>
          ) : isLoadingLeaderboard ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography color="white">
                {t('beatmap.loading_leaderboard')}
              </Typography>
            </Box>
          ) : leaderboardError ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography color="error">{leaderboardError}</Typography>
            </Box>
          ) : displayedScores.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography color="white">
                {t('beatmap.no_scores_available')}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={isMobile ? 2 : 1}>
              {displayedScores.map((score, index) => (
                <LeaderboardScoreItem
                  key={`${score.playerId}-${index}`}
                  score={score}
                  index={index}
                  isMobile={isMobile}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

const GRID_COLUMNS = '75px 2fr 1fr 1fr 1fr 1fr 2fr 48px';

const LeaderboardTableHeader = ({ t }: { t: any }) => (
  <GridLegacy
    display="grid"
    gridTemplateColumns={GRID_COLUMNS}
    alignItems="center"
    px={0}
    py={1}
    sx={{
      background: '#191527',
      borderRadius: 2,
      mb: 1,
    }}
  >
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minWidth="75px"
    >
      <Typography fontSize={15} fontWeight={300} color="hsl(0deg 0 100% / 60%)">
        #
      </Typography>
    </Box>
    <Box display="flex" alignItems="center" pl={2} minWidth="150px">
      <Typography fontSize={15} fontWeight={300} color="hsl(0deg 0 100% / 60%)">
        {t('leaderboard.player')}
      </Typography>
    </Box>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      pr={2}
      minWidth="100px"
    >
      <Typography fontSize={15} fontWeight={300} color="hsl(0deg 0 100% / 60%)">
        {t('leaderboard.score')}
      </Typography>
    </Box>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      pr={2}
      minWidth="80px"
    >
      <Typography fontSize={15} fontWeight={300} color="hsl(0deg 0 100% / 60%)">
        {t('leaderboard.accuracy_2')}
      </Typography>
    </Box>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      pr={2}
      minWidth="80px"
    >
      <Typography fontSize={15} fontWeight={300} color="hsl(0deg 0 100% / 60%)">
        {t('leaderboard.combo')}
      </Typography>
    </Box>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      pr={2}
      minWidth="90px"
    >
      <Typography fontSize={15} fontWeight={300} color="hsl(0deg 0 100% / 60%)">
        {t('leaderboard.pp')}
      </Typography>
    </Box>
    <Box display="flex" alignItems="center" pl={1} minWidth="140px">
      <Typography fontSize={15} fontWeight={300} color="hsl(0deg 0 100% / 60%)">
        {t('leaderboard.mods')}
      </Typography>
    </Box>
    <Box minWidth="48px" />
  </GridLegacy>
);

const LeaderboardScoreItem = ({
  score,
  index,
  isMobile,
}: {
  score: LeaderboardDetails;
  index: number;
  isMobile: boolean;
}) => {
  const { t } = useTranslation();

  if (isMobile) {
    return (
      <Stack direction="column" borderRadius={4} mt={1} overflow="hidden">
        <Stack direction="row" bgcolor={USER_INFO_BG_COLOR}>
          <Box
            minWidth={75}
            p={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor={USER_RANK_BG_COLOR}
          >
            <Typography variant="body1">#{index + 1}</Typography>
          </Box>
          <Box display="flex" alignItems="center" p={1}>
            <Box
              component="img"
              src={getFlagUrl(score.country.toUpperCase())}
              sx={{
                width: 24,
                height: 18,
                objectFit: 'cover',
                borderRadius: 0.5,
                mr: 1,
              }}
            />
            <Link
              to={`/u/${score.playerId}`}
              style={{
                color: '#FFFFFF',
                textDecoration: 'none',
              }}
            >
              <Typography variant="body1">{score.name}</Typography>
            </Link>
          </Box>
          <Box ml="auto" mr={1}>
            <ScoreOptionsMenu score={score} />
          </Box>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-around"
          bgcolor={USER_RANK_BG_COLOR}
        >
          <Stack direction="row" p={1}>
            <Typography fontSize={15} fontWeight={300}>
              {t('leaderboard.score')}:&nbsp;
            </Typography>
            <Typography>{score.tScore.toLocaleString()}</Typography>
          </Stack>
          <Stack direction="row" p={1}>
            <Typography fontSize={15} fontWeight={300}>
              {t('leaderboard.accuracy_2')}:&nbsp;
            </Typography>
            <Typography>{score.acc.toFixed(2)}%</Typography>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-around"
          bgcolor={USER_RANK_BG_COLOR}
        >
          <Stack direction="row" p={1}>
            <Typography fontSize={15} fontWeight={300}>
              {t('leaderboard.combo')}:&nbsp;
            </Typography>
            <Typography>{score.maxCombo}x</Typography>
          </Stack>
          <Stack direction="row" p={1}>
            <Typography fontSize={15} fontWeight={300}>
              {t('leaderboard.pp')}:&nbsp;
            </Typography>
            <Typography>{score.pp.toFixed(2)}pp</Typography>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          p={1}
          bgcolor={USER_RANK_BG_COLOR}
        >
          <Typography fontSize={15} fontWeight={300} mr={1}>
            {t('leaderboard.mods')}:
          </Typography>
          <Box display="flex" gap={0.5} sx={{ flexWrap: 'wrap' }}>
            {getIndividualMods(score.mods).map((mod) => (
              <ModIcon key={mod} variant={mod} width={35} height={24} />
            ))}
          </Box>
        </Stack>
      </Stack>
    );
  }

  return (
    <GridLegacy
      display="grid"
      mb={1}
      gridTemplateColumns={GRID_COLUMNS}
      borderRadius={2}
      overflow="hidden"
      sx={{
        background: USER_INFO_BG_COLOR,
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.05)',
          cursor: 'pointer',
        },
        transition: 'background-color 0.2s ease',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={USER_RANK_BG_COLOR}
        height="100%"
        minWidth="75px"
      >
        <Typography variant="body1">#{index + 1}</Typography>
      </Box>
      <Box display="flex" alignItems="center" pl={2} minWidth="0">
        <Box
          component="img"
          src={getFlagUrl(score.country.toUpperCase())}
          sx={{
            width: 24,
            height: 18,
            objectFit: 'cover',
            borderRadius: 0.5,
            mr: 1,
          }}
        />
        <Link
          to={`/u/${score.playerId}`}
          style={{
            color: '#FFFFFF',
            textDecoration: 'none',
            fontWeight: 300,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography variant="body1">{score.name}</Typography>
        </Link>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        pr={2}
        minWidth="100px"
      >
        <Typography variant="body2" color="white">
          {score.tScore.toLocaleString()}
        </Typography>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        pr={2}
        minWidth="80px"
      >
        <Typography variant="body2" color="white">
          {score.acc.toFixed(2)}%
        </Typography>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        pr={2}
        minWidth="80px"
      >
        <Typography variant="body2" color="white">
          {score.maxCombo}x
        </Typography>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        pr={2}
        minWidth="90px"
      >
        <Typography variant="body2" color="white">
          {score.pp.toFixed(2)}pp
        </Typography>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        pl={1}
        sx={{
          flexWrap: 'wrap',
          gap: 0.5,
        }}
      >
        {getIndividualMods(score.mods).map((mod) => (
          <ModIcon key={mod} variant={mod} width={35} height={24} />
        ))}
      </Box>
      <Box display="flex" justifyContent="center" minWidth="48px">
        <ScoreOptionsMenu score={score} />
      </Box>
    </GridLegacy>
  );
};
