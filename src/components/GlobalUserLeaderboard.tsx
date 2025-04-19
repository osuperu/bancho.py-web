import {
  Alert,
  Box,
  Grid,
  Skeleton,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import {
  fetchLeaderboard,
  LeaderboardResponse,
  LeaderboardUser,
} from "../adapters/bpy-api/leaderboard"
import { GameMode, mapToBpyMode, RelaxMode } from "../GameModes"
import {
  formatDecimal,
  formatNumber,
  formatNumberCompact,
} from "../utils/formatting"
import { FlagIcon } from "./DestinationIcons"

const USER_RANK_BG_COLOR = "rgba(21, 18, 35, 1)"
const USER_INFO_BG_COLOR = "rgba(30, 27, 47, 1)"
const SCORE_METRIC_BG_COLOR = "rgba(38, 34, 56, 1)"

export enum SortParam {
  Performance = "pp",
  Score = "tscore",
}

export interface CountrySelection {
  countryCode: string
  countryName: string
}

const LeaderboardTableHeader = ({
  rankingStatistic,
  isMobile,
}: {
  rankingStatistic: string
  isMobile: boolean
}) => {
  const { t } = useTranslation()

  if (isMobile) return <></>

  return (
    <Grid display="grid" gridTemplateColumns="75px 1fr 102px 102px 102px">
      <Grid p={1} display="flex" justifyContent="center">
        <Typography display="none">Rank</Typography>
      </Grid>
      <Grid p={1}>
        <Typography display="none">Username</Typography>
      </Grid>
      <Grid p={1} display="flex" justifyContent="center">
        <Typography
          fontSize={15}
          fontWeight={300}
          color="hsl(0deg 0 100% / 60%)"
        >
          {t("leaderboard.play_count")}
        </Typography>
      </Grid>
      <Grid p={1} display="flex" justifyContent="center">
        <Typography
          fontSize={15}
          fontWeight={300}
          color="hsl(0deg 0 100% / 60%)"
        >
          {t("leaderboard.accuracy")}
        </Typography>
      </Grid>
      <Grid p={1} display="flex" justifyContent="center">
        <Typography fontSize={15} fontWeight={300}>
          {rankingStatistic}
        </Typography>
      </Grid>
    </Grid>
  )
}

const MobileLeaderboardUserCard = ({
  user,
  sortParam,
  userRank,
}: {
  user: LeaderboardUser
  sortParam: SortParam
  userRank: number
}) => {
  const { t } = useTranslation()

  const isPPLeaderboard = sortParam === SortParam.Performance

  return (
    <Stack direction="column" borderRadius={4} mt={1} overflow="hidden">
      <Stack direction="row" bgcolor={USER_INFO_BG_COLOR}>
        <Box
          minWidth={75}
          p={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor={SCORE_METRIC_BG_COLOR}
        >
          <Typography variant="body1">#{userRank}</Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          p={1}
          height="100%"
          sx={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
        >
          <FlagIcon country={user.country} height={36} width={36} />
          <Link
            to={`/u/${user.playerId}`}
            // eslint-disable-next-line react/forbid-component-props
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            <Typography variant="body1" ml={1}>
              {user.name}
            </Typography>
          </Link>
        </Box>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-around"
        bgcolor={USER_RANK_BG_COLOR}
      >
        <Stack direction="row" p={1}>
          <Typography fontSize={15} fontWeight={300}>
            {t("leaderboard.accuracy")}:&nbsp;
          </Typography>
          <Typography>{formatDecimal(user.acc)}%</Typography>
        </Stack>
        <Stack direction="row" p={1}>
          {isPPLeaderboard ? (
            <Typography variant="body1">${formatNumber(user.pp)}pp</Typography>
          ) : (
            <Tooltip title={formatNumber(user.rScore)}>
              <Typography variant="body1">
                {formatNumberCompact(user.rScore)}
              </Typography>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}

const LeaderboardUserCard = ({
  user,
  isMobile,
  sortParam,
  userRank,
}: {
  user: LeaderboardUser
  isMobile: boolean
  sortParam: SortParam
  userRank: number
}) => {
  if (isMobile) {
    return (
      <MobileLeaderboardUserCard
        user={user}
        sortParam={sortParam}
        userRank={userRank}
      />
    )
  }

  const isPPLeaderboard = sortParam === SortParam.Performance

  return (
    <Link
      to={`/u/${user.playerId}`}
      // eslint-disable-next-line react/forbid-component-props
      style={{
        color: "#FFFFFF",
        textDecoration: "none",
      }}
    >
      <Grid
        display="grid"
        mb={1}
        gridTemplateColumns="75px 1fr 102px 102px 102px"
        borderRadius={2}
        overflow="hidden"
        bgcolor={USER_INFO_BG_COLOR}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor={USER_RANK_BG_COLOR}
        >
          <Typography variant="body1">#{userRank}</Typography>
        </Box>
        <Box bgcolor={USER_RANK_BG_COLOR}>
          <Box
            display="flex"
            alignItems="center"
            p={1}
            height="100%"
            bgcolor={USER_INFO_BG_COLOR}
            sx={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
          >
            <FlagIcon country={user.country} height={36} width={36} />
            <Typography variant="body1" ml={1}>
              {user.name}
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="hsl(0deg 0 100% / 60%)"
        >
          <Typography variant="body1">{formatNumber(user.plays)}</Typography>
        </Box>
        <Box bgcolor={SCORE_METRIC_BG_COLOR}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor={USER_INFO_BG_COLOR}
            color="hsl(0deg 0 100% / 60%)"
            height="100%"
            sx={{ borderTopRightRadius: 8, borderBottomRightRadius: 8 }}
          >
            <Typography variant="body1">{formatDecimal(user.acc)}%</Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor={SCORE_METRIC_BG_COLOR}
        >
          {isPPLeaderboard ? (
            <Typography variant="body1">{formatNumber(user.pp)}pp</Typography>
          ) : (
            <Tooltip title={formatNumber(user.rScore)}>
              <Typography variant="body1">
                {formatNumberCompact(user.rScore)}
              </Typography>
            </Tooltip>
          )}
        </Box>
      </Grid>
    </Link>
  )
}

export const GlobalUserLeaderboard = ({
  gameMode,
  relaxMode,
  sortParam,
  countryCode,
}: {
  gameMode: GameMode
  relaxMode: RelaxMode
  sortParam: SortParam
  countryCode: string | null
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [error, setError] = useState("")

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(50)

  const [loading, setLoading] = useState(true)

  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardResponse | null>(null)

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      try {
        const bpyMode = mapToBpyMode(gameMode, relaxMode)
        const leaderboardResponse = await fetchLeaderboard({
          mode: bpyMode,
          country: countryCode?.toLowerCase() ?? undefined,
          sort: sortParam,
        })
        setLeaderboardData(leaderboardResponse)
        setLoading(false)
        setError("")
      } catch (e: any) {
        setError("Failed to fetch data from server")
        return
      }
    })()
  }, [gameMode, relaxMode, page, pageSize, countryCode, sortParam])

  if (loading || !leaderboardData) {
    return (
      <>
        {Array.from({ length: pageSize }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={75}></Skeleton>
        ))}
      </>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <>
      <LeaderboardTableHeader
        isMobile={isMobile}
        rankingStatistic={sortParam}
      />
      <Stack>
        {leaderboardData.leaderboard?.map(
          (user: LeaderboardUser, userPageRank: number) => (
            <LeaderboardUserCard
              key={user.playerId}
              isMobile={isMobile}
              user={user}
              userRank={userPageRank + page * pageSize + 1}
              sortParam={sortParam}
            />
          )
        ) ?? (
          <Alert severity="warning">
            <Typography variant="body1">No users found!</Typography>
          </Alert>
        )}
      </Stack>
      <TablePagination
        component={Box}
        sx={{ background: "#191527" }}
        count={-1}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setPageSize(parseInt(event.target.value, 10))
          setPage(0)
        }}
        labelDisplayedRows={({ from, to }) => {
          return `Results ${from}-${to}`
        }}
      />
    </>
  )
}
