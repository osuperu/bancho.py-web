import MoreVertIcon from "@mui/icons-material/MoreVert"
import {
  Alert,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { LeaderboardDetails } from "../../adapters/bpy-api/beatmaps"
import { getFlagUrl } from "../../utils/countries"

interface Difficulty {
  id: number
  name: string
}

const DownloadReplayMenuItem = ({
  score,
  handleMenuClose,
}: {
  score: LeaderboardDetails
  handleMenuClose: () => void
}) => {
  const { t } = useTranslation()

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
      <Typography color="white">{t("leaderboard.download_replay")}</Typography>
    </MenuItem>
  )
}

const ViewScoreMenuItem = ({
  score,
  handleMenuClose,
}: {
  score: LeaderboardDetails
  handleMenuClose: () => void
}) => {
  const { t } = useTranslation()

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
      <Typography color="white">{t("leaderboard.view_score")}</Typography>
    </MenuItem>
  )
}

const ScoreOptionsMenu = ({ score }: { score: LeaderboardDetails }) => {
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
          zIndex: 2,
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

export const BeatmapLeaderboard = ({
  leaderboard,
  isLoadingLeaderboard,
  leaderboardError,
  selectedDifficulty,
  showAllScores,
  toggleScoresView,
}: {
  leaderboard: LeaderboardDetails[] | null
  isLoadingLeaderboard: boolean
  leaderboardError: string | null
  selectedDifficulty: Difficulty | null
  showAllScores: boolean
  toggleScoresView: () => void
}) => {
  const { t } = useTranslation()

  const displayedScores = leaderboard
    ? showAllScores
      ? leaderboard
      : leaderboard.slice(0, 20)
    : []

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        background: "#191527",
        maxHeight: "800px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" sx={{ pb: 1 }}>
          {t("beatmap.top_scores")}{" "}
          {leaderboard
            ? `(${showAllScores ? leaderboard.length : Math.min(20, leaderboard.length)})`
            : ""}
        </Typography>
        {leaderboard && leaderboard.length > 20 && (
          <Button
            variant="text"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              textTransform: "none",
              fontSize: 16,
              "&:hover": {
                color: "white",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={toggleScoresView}
          >
            {showAllScores
              ? t("beatmap.show_top_20")
              : t("beatmap.view_all_scores")}
          </Button>
        )}
      </Stack>

      <Box sx={{ overflowY: "auto", flex: 1 }}>
        {!selectedDifficulty ? (
          <Alert
            severity="info"
            sx={{ bgcolor: "rgba(13, 59, 102, 0.5)", color: "white" }}
          >
            {t("beatmap.no_diffs_available")}
          </Alert>
        ) : isLoadingLeaderboard ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography color="white">
              {t("beatmap.loading_leaderboard")}
            </Typography>
          </Box>
        ) : leaderboardError ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography color="error">{leaderboardError}</Typography>
          </Box>
        ) : displayedScores.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography color="white">
              {t("beatmap.no_scores_available")}
            </Typography>
          </Box>
        ) : (
          displayedScores.map((score, index) => (
            <LeaderboardScoreItem
              key={`${score.playerId}-${index}`}
              score={score}
              index={index}
            />
          ))
        )}
      </Box>
    </Paper>
  )
}

const LeaderboardScoreItem = ({
  score,
  index,
}: {
  score: LeaderboardDetails
  index: number
}) => {
  return (
    <Link
      to={`/u/${score.playerId}`}
      // eslint-disable-next-line react/forbid-component-props
      style={{
        color: "#FFFFFF",
        textDecoration: "none",
        display: "block",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          p: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          "&:last-child": { borderBottom: "none" },
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.05)",
            cursor: "pointer",
          },
          transition: "background-color 0.2s ease",
        }}
      >
        {/* Mobile View */}
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            flexDirection: "column",
            width: "100%",
          }}
        >
          {/* Top row with rank, flag, player name and options menu */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                color="rgba(255, 255, 255, 0.5)"
                sx={{
                  width: 30,
                  mr: 1,
                }}
              >
                #{index + 1}
              </Typography>
              <Box
                component="img"
                src={getFlagUrl(score.country.toUpperCase())}
                sx={{
                  width: 20,
                  height: 15,
                  objectFit: "cover",
                  borderRadius: 0.5,
                  mr: 1,
                }}
              />
              <Typography variant="body1" color="white" fontWeight={300}>
                {score.name}
              </Typography>
            </Box>
            <ScoreOptionsMenu score={score} />
          </Box>

          {/* Bottom row with score details in a nice grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1,
              ml: 4, // Indent to align with player name
            }}
          >
            <Box>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                PUNTUACIÓN
              </Typography>
              <Typography variant="body2" color="white">
                {score.tScore.toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                PRECISIÓN
              </Typography>
              <Typography variant="body2" color="white">
                {score.acc.toFixed(2)}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                COMBO
              </Typography>
              <Typography variant="body2" color="white">
                {score.maxCombo}x
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                PP
              </Typography>
              <Typography variant="body2" color="white">
                {score.pp.toFixed(2)}pp
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Desktop View */}
        <Box display={{ xs: "none", sm: "flex" }} alignItems="center" gap={2}>
          <Typography
            variant="body2"
            color="rgba(255, 255, 255, 0.5)"
            width={30}
          >
            #{index + 1}
          </Typography>
          <Box
            component="img"
            src={getFlagUrl(score.country.toUpperCase())}
            sx={{
              width: 20,
              height: 15,
              objectFit: "cover",
              borderRadius: 0.5,
              mr: 1,
            }}
          />
          <Typography variant="body1" color="white" fontWeight={300}>
            {score.name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 4,
          }}
        >
          <Typography variant="body2" color="white">
            {score.tScore.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="white">
            {score.acc.toFixed(2)}%
          </Typography>
          <Typography variant="body2" color="white">
            {score.maxCombo}x
          </Typography>
          <Typography variant="body2" color="white">
            {score.pp.toFixed(2)}pp
          </Typography>
          <ScoreOptionsMenu score={score} />
        </Box>
      </Box>
    </Link>
  )
}
