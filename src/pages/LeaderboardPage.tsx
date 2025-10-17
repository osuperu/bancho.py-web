import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { GlobalIcon } from '../components/DestinationIcons';
import { GamemodeSelectionBar } from '../components/GamemodeSelectionBar';
import {
  type CountrySelection,
  GlobalUserLeaderboard,
  SortParam,
} from '../components/GlobalUserLeaderboard';
import LeaderboardBanner from '../components/images/banners/leaderboard_banner.svg';
import { LeaderboardIcon } from '../components/images/logos/icons/LeaderboardIcon';
import { PageTitle } from '../components/PageTitle';
import { GameMode, RelaxMode } from '../GameModes';
import { ALPHA2_COUNTRY_LIST, getFlagUrl } from '../utils/countries';

const CountryMenuItem = ({
  divider,
  countryCode,
  countryName,
  setCountry,
  handleClose,
}: {
  divider?: boolean;
  countryCode: string;
  countryName: string;
  setCountry: (country: CountrySelection | null) => void;
  handleClose: () => void;
}) => {
  return (
    <MenuItem
      key={countryCode}
      onClick={() => {
        setCountry(countryCode !== 'all' ? { countryCode, countryName } : null);
        handleClose();
      }}
      divider={divider}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        {countryCode !== 'all' ? (
          <Box
            component="img"
            src={getFlagUrl(countryCode)}
            alt={countryCode}
            height={20}
            width={20}
          />
        ) : (
          <GlobalIcon width={20} height={20} />
        )}
        <Typography variant="body1">{countryName}</Typography>
      </Stack>
    </MenuItem>
  );
};
const CountrySelectorMenu = ({
  country,
  setCountry,
}: {
  country: CountrySelection | null;
  setCountry: (country: CountrySelection | null) => void;
}) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container>
      <Stack direction="column" py={2}>
        <Typography variant="body1">{t('leaderboard.country')}</Typography>
        <Button
          id={useId()}
          sx={{
            color: 'white',
            textTransform: 'none',
            bgcolor: '#110E1B',
            // TODO: make this grid-based/responsive
            minWidth: 300,
            justifyContent: 'flex-start',
            borderRadius: 3,
          }}
          onClick={handleClick}
        >
          {country?.countryName ?? t('leaderboard.all')}
        </Button>
        <Menu
          id={useId()}
          MenuListProps={{
            'aria-labelledby': 'country-selection-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <CountryMenuItem
            key="all"
            divider
            countryCode="all"
            countryName="All"
            setCountry={setCountry}
            handleClose={handleClose}
          />
          {Object.entries(ALPHA2_COUNTRY_LIST).map(
            ([countryCode, countryName]) => (
              <CountryMenuItem
                key={countryCode}
                countryCode={countryCode}
                countryName={countryName}
                setCountry={setCountry}
                handleClose={handleClose}
              />
            ),
          )}
        </Menu>
      </Stack>
    </Grid>
  );
};

interface LeaderboardQueryParams {
  mode: GameMode;
  relax: RelaxMode;
  sort: SortParam;
  country: CountrySelection | null;
}

const parseLeaderboardQueryParams = (
  queryParams: URLSearchParams,
): LeaderboardQueryParams => {
  const requestedGameMode = queryParams.get('mode');
  let defaultGameMode = GameMode.Standard;
  if (requestedGameMode !== null) {
    const mode = parseInt(requestedGameMode, 10);
    if (!Number.isNaN(mode) && mode >= 0 && mode <= 3) {
      defaultGameMode = mode;
    }
  }

  const requestedRelaxMode = queryParams.get('relax');
  let defaultRelaxMode = RelaxMode.Vanilla;
  if (requestedRelaxMode !== null) {
    const mode = parseInt(requestedRelaxMode, 10);
    if (!Number.isNaN(mode) && mode >= 0 && mode <= 2) {
      defaultRelaxMode = mode;
    }
  }

  const requestedSortParam = queryParams.get('sort');
  let defaultSortParam = SortParam.Performance;
  if (requestedSortParam !== null) {
    const sortParam = requestedSortParam as SortParam;
    if (Object.values(SortParam).includes(sortParam)) {
      defaultSortParam = sortParam;
    }
  }

  const requestedCountryCode =
    queryParams.get('country')?.toUpperCase() ?? null;
  let defaultCountry = null;
  if (requestedCountryCode !== null) {
    const countryName = ALPHA2_COUNTRY_LIST[requestedCountryCode];
    if (countryName) {
      defaultCountry = {
        countryCode: requestedCountryCode,
        countryName,
      };
    }
  }

  return {
    mode: defaultGameMode,
    relax: defaultRelaxMode,
    sort: defaultSortParam,
    country: defaultCountry,
  };
};

const SortParamSelector = ({
  targetSort,
  sortParam,
  setSortParam,
}: {
  targetSort: SortParam;
  sortParam: SortParam;
  setSortParam: (sort: SortParam) => void;
}) => {
  const isSelected = sortParam === targetSort;
  return (
    <Box onClick={() => setSortParam(targetSort)}>
      <Typography
        fontSize={21}
        fontWeight={isSelected ? 700 : 200}
        sx={[
          {
            '&:hover': {
              cursor: 'pointer',
              color: 'hsl(0deg 0% 100% / 80%)',
            },
          },
        ]}
      >
        {targetSort}
      </Typography>
    </Box>
  );
};

export const LeaderboardPage = () => {
  const [queryParams, setQueryParams] = useSearchParams();
  const parsedQueryParams = parseLeaderboardQueryParams(queryParams);

  const [gameMode, _setGameMode] = useState(parsedQueryParams.mode);
  const [relaxMode, _setRelaxMode] = useState(parsedQueryParams.relax);
  const [sortParam, _setSortParam] = useState(parsedQueryParams.sort);
  const [country, _setCountry] = useState<CountrySelection | null>(
    parsedQueryParams.country,
  );

  const setGameMode = (newGameMode: GameMode) => {
    _setGameMode(newGameMode);
    setQueryParams((searchParams) => {
      searchParams.set('mode', newGameMode.toString());
      return searchParams;
    });
  };

  const setRelaxMode = (newRelaxMode: RelaxMode) => {
    _setRelaxMode(newRelaxMode);
    setQueryParams((searchParams) => {
      searchParams.set('relax', newRelaxMode.toString());
      return searchParams;
    });
  };

  const setSortParam = (newSortParam: SortParam) => {
    _setSortParam(newSortParam);
    setQueryParams((searchParams) => {
      searchParams.set('sort', newSortParam);
      return searchParams;
    });
  };

  const setCountry = (newCountry: CountrySelection | null) => {
    _setCountry(newCountry);
    setQueryParams((searchParams) => {
      if (newCountry !== null) {
        searchParams.set('country', newCountry.countryCode.toLowerCase());
      } else {
        searchParams.delete('country');
      }
      return searchParams;
    });
  };

  const { t } = useTranslation();

  return (
    <>
      <PageTitle title={`osu!Peru - ${t('web_titles.leaderboard')}`} />
      <Box
        height={211}
        pt={{ xs: 0, sm: 10 }}
        sx={{
          backgroundSize: 'cover',
          backgroundImage: `
            linear-gradient(0deg, rgba(21, 18, 34, 0) 0%, rgba(21, 18, 34, 0.9) 100%),
            url(${LeaderboardBanner})
          `,
        }}
      >
        <Container sx={{ height: '100%' }}>
          <Stack
            px={3}
            height="100%"
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent={{ xs: 'space-around', sm: 'space-between' }}
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" gap={3}>
              <Box width={70} height={70}>
                <LeaderboardIcon />
              </Box>
              <Divider
                flexItem
                orientation="vertical"
                variant="middle"
                sx={{ bgcolor: '#ffffff', opacity: '20%' }}
              />
              <Typography variant="body1" fontSize={25} fontWeight={300}>
                {t('leaderboard.title')}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              gap={3}
              fontSize={21}
              fontWeight={200}
            >
              {/* <Typography fontSize={21} fontWeight={200}>clans</Typography> */}
              <SortParamSelector
                targetSort={SortParam.Score}
                sortParam={sortParam}
                setSortParam={setSortParam}
              />
              <SortParamSelector
                targetSort={SortParam.Performance}
                sortParam={sortParam}
                setSortParam={setSortParam}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>
      {/* Mode Switches */}
      <Box width="100%" bgcolor="#211D35" color="#FFFFFF80">
        <Container>
          <GamemodeSelectionBar
            gameMode={gameMode}
            setGameMode={setGameMode}
            relaxMode={relaxMode}
            setRelaxMode={setRelaxMode}
          />
        </Container>
      </Box>
      <Container sx={{ backgroundColor: '#151223' }}>
        <CountrySelectorMenu country={country} setCountry={setCountry} />
      </Container>
      <Container sx={{ backgroundColor: '#191527' }}>
        <GlobalUserLeaderboard
          gameMode={gameMode}
          relaxMode={relaxMode}
          sortParam={sortParam}
          countryCode={country?.countryCode ?? null}
        />
      </Container>
    </>
  );
};
