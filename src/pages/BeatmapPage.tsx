import { Box, Container, Paper, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import {
  BeatmapDetails,
  Difficulty,
  getBeatmapLeaderboard,
  getBeatmapSet,
  LeaderboardDetails,
} from "../adapters/bpy-api/beatmaps"
import { BeatmapHeader } from "../components/beatmap/BeatmapHeader"
import { BeatmapInfo } from "../components/beatmap/BeatmapInfo"
import { BeatmapLeaderboard } from "../components/beatmap/BeatmapLeaderboard"
import { BeatmapStatDisplay } from "../components/beatmap/BeatmapStatDisplay"
import { GamemodeSelectionBar } from "../components/GamemodeSelectionBar"
import { GameMode, mapToBpyMode, RelaxMode } from "../GameModes"

export const BeatmapPage = () => {
  const queryParams = useParams()
  const beatmapId = Number.parseInt(queryParams["beatmapId"] || "0")

  const [beatmap, setBeatmap] = useState<BeatmapDetails | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null)
  const [showAllScores, setShowAllScores] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardDetails[] | null>(
    null
  )
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null)
  const [gameMode, setGameMode] = useState(GameMode.Standard)
  const [relaxMode, setRelaxMode] = useState(RelaxMode.Vanilla)
  const [filteredDifficulties, setFilteredDifficulties] = useState<
    Difficulty[]
  >([])

  const filterDifficultiesByGameMode = (
    difficulties: Difficulty[],
    mode: GameMode
  ) => {
    if (mode === GameMode.Standard) {
      return difficulties.filter((diff) => diff.gameMode === GameMode.Standard)
    }

    const nativeDifficulties = difficulties.filter((diff) => {
      return diff.gameMode === mode
    })

    const convertedDifficulties = difficulties.filter(
      (diff) => diff.gameMode === GameMode.Standard
    )

    return [...nativeDifficulties, ...convertedDifficulties]
  }

  useEffect(() => {
    const fetchBeatmap = async () => {
      try {
        const beatmapSet = await getBeatmapSet(beatmapId)

        if (
          beatmapSet.status === "success" &&
          beatmapSet.beatmap &&
          beatmapSet.beatmap.length > 0
        ) {
          const firstBeatmap = beatmapSet.beatmap[0]

          setBeatmap(firstBeatmap)

          const filtered = filterDifficultiesByGameMode(
            firstBeatmap.difficulties,
            gameMode
          )
          setFilteredDifficulties(filtered)

          if (filtered.length > 0) {
            setSelectedDifficulty(filtered[0])
          } else {
            setSelectedDifficulty(null)
          }
        } else {
          // TODO: Do something if the beatmap is not found
        }
      } catch (error) {
        // TODO: Do something if the API call fails
      }
    }

    fetchBeatmap()
  }, [beatmapId, gameMode])

  useEffect(() => {
    if (beatmap) {
      const filtered = filterDifficultiesByGameMode(
        beatmap.difficulties,
        gameMode
      )
      setFilteredDifficulties(filtered)

      if (filtered.length > 0) {
        if (!filtered.some((d) => d.id === selectedDifficulty?.id)) {
          setSelectedDifficulty(filtered[0])
        }
      } else {
        setSelectedDifficulty(null)
      }
    }
  }, [gameMode, beatmap, selectedDifficulty?.id])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedDifficulty) {
        setLeaderboard(null)
        return
      }

      setIsLoadingLeaderboard(true)
      setLeaderboardError(null)

      try {
        let bpyMode
        try {
          bpyMode = mapToBpyMode(gameMode, relaxMode)
        } catch (error) {
          setLeaderboardError("Invalid combination of game mode and relax mode")
          setLeaderboard(null)
          setIsLoadingLeaderboard(false)
          return
        }

        const response = await getBeatmapLeaderboard(
          selectedDifficulty.id,
          bpyMode
        )

        if (response.status === "success" && response.leaderboard) {
          setLeaderboard(response.leaderboard)
        } else {
          setLeaderboardError("Failed to load scores")
          setLeaderboard(null)
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
        setLeaderboardError("Failed to load scores")
        setLeaderboard(null)
      } finally {
        setIsLoadingLeaderboard(false)
      }
    }

    fetchLeaderboard()
  }, [selectedDifficulty, gameMode, relaxMode])

  const toggleScoresView = () => {
    setShowAllScores(!showAllScores)
  }

  const handleGameModeChange = (newMode: GameMode) => {
    setGameMode(newMode)
    setLeaderboard(null)
  }

  const handleRelaxModeChange = (newMode: RelaxMode) => {
    setRelaxMode(newMode)
    setLeaderboard(null)
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#151223" }}>
      {/* Beatmap Header */}
      <BeatmapHeader
        beatmap={beatmap}
        filteredDifficulties={filteredDifficulties}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        gameMode={gameMode}
      />

      <Box bgcolor="#FFBD3B99" width="100%" height={2} />
      <Box
        width="100%"
        bgcolor="#211D35"
        color="#FFFFFF80"
        position="relative"
        zIndex={2}
      >
        <Container>
          <GamemodeSelectionBar
            gameMode={gameMode}
            setGameMode={handleGameModeChange}
            relaxMode={relaxMode}
            setRelaxMode={handleRelaxModeChange}
          />
        </Container>
      </Box>

      <Container
        disableGutters
        maxWidth={false}
        sx={{ px: { xs: 2, sm: 3, md: 4 }, maxWidth: "1200px", mx: "auto" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{ width: "100%", mt: 3 }}
        >
          <Box sx={{ width: { xs: "100%", md: "66.67%" } }}>
            <BeatmapLeaderboard
              leaderboard={leaderboard}
              isLoadingLeaderboard={isLoadingLeaderboard}
              leaderboardError={leaderboardError}
              selectedDifficulty={selectedDifficulty}
              showAllScores={showAllScores}
              toggleScoresView={toggleScoresView}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "33.33%" } }}>
            <Stack spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: "#191527",
                }}
              >
                <Typography variant="h6" sx={{ pb: 1 }}>
                  Beatmap Stats
                </Typography>

                {selectedDifficulty ? (
                  <BeatmapStatDisplay difficulty={selectedDifficulty} />
                ) : (
                  <Typography color="white" fontStyle="italic">
                    This beatmap has no difficulties available for this gamemode
                  </Typography>
                )}
              </Paper>

              <BeatmapInfo beatmap={beatmap} />
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
