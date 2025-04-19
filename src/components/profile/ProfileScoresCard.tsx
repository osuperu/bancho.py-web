import MoreVertIcon from "@mui/icons-material/MoreVert"
import { IconButton, Paper, TablePagination, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import {
  fetchUserScores,
  type UserScore,
  type UserScoresResponse,
} from "../../adapters/bpy-api/userScores"
import { type GameMode, mapToBpyMode, type RelaxMode } from "../../GameModes"
import { calculateGrade, getGradeColor, remapSSForDisplay } from "../../scores"
import { formatDecimal, formatNumber } from "../../utils/formatting"
import { getIndividualMods } from "../../utils/mods"
import { ModIcon } from "../ModIcon"

const DownloadReplayMenuItem = ({
  score,
  handleMenuClose,
}: {
  score: UserScore
  handleMenuClose: () => void
}) => {
  const handleDownloadClick = () => {
    handleMenuClose()
  }

  return (
    <MenuItem
      key="download-replay"
      component={Link}
      to={`${process.env.REACT_APP_BPY_API_BASE_URL}/v1/get_replay?id=${score.id}`}
      onClick={handleDownloadClick}
    >
      <Typography color="white">Download Replay</Typography>
    </MenuItem>
  )
}

const ViewScoreMenuItem = ({
  score,
  handleMenuClose,
}: {
  score: UserScore
  handleMenuClose: () => void
}) => {
  const handleViewClick = () => {
    handleMenuClose()
  }

  return (
    <MenuItem
      key="view-score"
      component={Link}
      to={`/scores/${score.id}`}
      onClick={handleViewClick}
    >
      <Typography color="white">View Score</Typography>
    </MenuItem>
  )
}

const ScoreOptionsMenu = ({ score }: { score: UserScore }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        onMouseDown={(e) => e.stopPropagation()}
        sx={{
          color: "rgba(255, 255, 255, 0.7)",
          "&:hover": {
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          zIndex: 9999,
          "& .MuiPaper-root": {
            backgroundColor: "#191527",
            color: "white",
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <DownloadReplayMenuItem score={score} handleMenuClose={handleClose} />
        <ViewScoreMenuItem score={score} handleMenuClose={handleClose} />
      </Menu>
    </>
  )
}

const ProfileScoreCard = (userScore: UserScore) => {
  const scoreGrade =
    calculateGrade(
      userScore.playMode,
      userScore.mods,
      userScore.accuracy,
      userScore.count300,
      userScore.count100,
      userScore.count50,
      userScore.countMiss
    ) ?? "F"

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
    >
      <Box
        minWidth={{ sm: 75 }}
        minHeight={{ xs: 40, sm: 0 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor={getGradeColor(scoreGrade)}
      >
        <Typography variant="h5" fontWeight="bold" color="#111111">
          {remapSSForDisplay(scoreGrade)}
        </Typography>
      </Box>
      <Box position="relative" overflow="hidden" flexGrow={1}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent={{ sm: "space-between" }}
          position="relative"
          zIndex={1}
          p={1}
        >
          {/* Left menu */}
          <Stack direction="column">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ sm: 1 }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              // TODO: adjust this to work better on xs/sm devices
              maxWidth="15vw"
            >
              <Typography noWrap variant="h6">
                {userScore.beatmap.title}&nbsp;
                <Box component="span" fontWeight="lighter" fontSize="1rem">
                  by {userScore.beatmap.artist}
                </Box>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2">
                {userScore.beatmap.version}
              </Typography>
              <Stack direction="row" alignItems="center" gap={0.25}>
                {getIndividualMods(userScore.mods).map((mod) => (
                  <ModIcon key={mod} variant={mod} width={29} height={20} />
                ))}
              </Stack>
            </Stack>
            {/* TODO: Add date played/timeago */}
          </Stack>
          {/* Right menu */}
          <Stack direction={{ xs: "column", sm: "row" }}>
            <Stack direction="column">
              <Box
                display="flex"
                justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    background: `
                    linear-gradient(0deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)),
                    linear-gradient(79.96deg, #387EFC 16.72%, #C940FD 91.26%),
                    #FFFFFF
                  `,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {Math.round(userScore.pp)}pp
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" fontWeight="lighter">
                  {formatNumber(userScore.score)}
                </Typography>
                <Typography variant="body2">
                  {formatDecimal(userScore.accuracy)}%
                </Typography>
              </Stack>
            </Stack>
            <Box
              display="flex"
              alignItems="center"
              onClick={handleOptionsClick}
              sx={{ zIndex: 2 }}
            >
              <ScoreOptionsMenu score={userScore} />
            </Box>
          </Stack>
        </Stack>
        {/* Background Image */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          zIndex={0}
          sx={{
            backgroundImage: `
              linear-gradient(90deg, ${getGradeColor(scoreGrade, 0.2)}, ${getGradeColor(scoreGrade, 0.0)} 48.5%),
              linear-gradient(0deg, rgba(22, 19, 35, 0.9), rgba(22, 19, 35, 0.9)),
              url(https://assets.ppy.sh/beatmaps/${userScore.beatmap.beatmapsetId}/covers/cover.jpg)
            `,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></Box>
      </Box>
    </Stack>
  )
}

export const ProfileScoresCard = ({
  scoresType,
  userId,
  gameMode,
  relaxMode,
  title,
}: {
  scoresType: "best" | "recent"
  userId: number
  gameMode: GameMode
  relaxMode: RelaxMode
  title: string
}) => {
  const [userScores, setUserScores] = useState<UserScoresResponse | null>(null)

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const [error, setError] = useState("")

  useEffect(() => {
    if (!userId) return
    ;(async () => {
      try {
        const bpyMode = mapToBpyMode(gameMode, relaxMode)
        const userScores = await fetchUserScores({
          scope: scoresType,
          mode: bpyMode,
          limit: pageSize,
          page: page + 1,
          id: userId,
        })
        setUserScores(userScores)
        setError("")
      } catch (e: any) {
        setError("Failed to fetch user scores data from server")
        return
      }
    })()
  }, [scoresType, userId, gameMode, relaxMode, page, pageSize])

  if (error) {
    return <Typography>{error}</Typography>
  }

  // TODO: show a friendly null state here
  // if (!userScores?.scores || userScores.scores.length === 0) {
  //   return <></>
  // }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ pb: 1 }}>
        {title}
      </Typography>
      <Stack spacing={1} sx={{ pb: 1 }}>
        {userScores?.scores?.map((score: UserScore) => (
          <Box key={score.id} borderRadius="16px" overflow="hidden">
            <Link
              to={`/b/${score.beatmap.beatmapId}`}
              // eslint-disable-next-line react/forbid-component-props
              style={{
                color: "#FFFFFF",
                textDecoration: "none",
                display: "block",
              }}
            >
              <Paper elevation={1}>
                <ProfileScoreCard {...score} />
              </Paper>
            </Link>
          </Box>
        ))}
      </Stack>

      <TablePagination
        component={Box}
        sx={{ background: "#191527" }}
        count={-1}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setPageSize(Number.parseInt(event.target.value, 10))
          setPage(0)
        }}
        labelDisplayedRows={({ from, to }) => {
          return `Results ${from}-${to}`
        }}
      />
    </Box>
  )
}
