import { Box, Chip, Container, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

import type {
  BeatmapDetails,
  Difficulty,
} from "../../adapters/bpy-api/beatmaps"
import { GameMode } from "../../GameModes"
import { BeatmapDifficultySelectionBar } from "./BeatmapDifficultySelectionBar"

export const BeatmapHeader = ({
  beatmap,
  filteredDifficulties,
  selectedDifficulty,
  setSelectedDifficulty,
  gameMode,
}: {
  beatmap: BeatmapDetails | null
  filteredDifficulties: Difficulty[]
  selectedDifficulty: Difficulty | null
  setSelectedDifficulty: (difficulty: Difficulty) => void
  gameMode: GameMode
}) => {
  const { t } = useTranslation()

  const isConvertedDifficulty =
    selectedDifficulty?.gameMode === GameMode.Standard &&
    gameMode !== GameMode.Standard

  const nativeDifficulties = filteredDifficulties.filter((diff) => {
    return diff.gameMode === gameMode
  })

  const convertedDifficulties = filteredDifficulties.filter(
    (diff) =>
      diff.gameMode === GameMode.Standard && gameMode !== GameMode.Standard
  )

  return (
    <Box
      pt={{ xs: 0, sm: 10 }}
      py={3}
      sx={{
        backgroundSize: "cover",
        backgroundImage: `url(${beatmap?.coverUrl})`,
        backgroundPosition: "center",
        boxShadow: "inset 0px 0px 0px 2000px rgba(21, 18, 34, 0.9)",
      }}
    >
      <Container>
        <Stack
          direction="column"
          justifyContent="space-between"
          borderRadius={4}
          overflow="hidden"
          sx={{
            backgroundSize: "cover",
            backgroundImage: `linear-gradient(90deg, rgba(15, 19, 38, 0.9) 0%, rgba(15, 19, 38, 0) 100%), url(${beatmap?.coverUrl})`,
            backgroundPosition: "center",
          }}
        >
          <Stack
            direction="column"
            p={3}
            sx={{
              backdropFilter: "blur(4px)",
              background:
                "linear-gradient(270deg, rgba(21, 18, 34, 0.44375) 0%, rgba(17, 14, 27, 0.04) 36%, rgba(25, 20, 39, 0.8) 100%)",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h5">
                {beatmap?.artist} - {beatmap?.title}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6">
                {selectedDifficulty?.name || t("beatmap.not_diff_available")}
              </Typography>
              {isConvertedDifficulty && (
                <Chip
                  label={t("beatmap.converted")}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 189, 59, 0.2)",
                    color: "#FFBD3B",
                    height: "20px",
                    fontSize: "0.7rem",
                  }}
                />
              )}
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack
              direction="column"
              justifyContent="space-around"
              px={3}
              py={2}
            >
              {filteredDifficulties.length > 0 ? (
                <>
                  <BeatmapDifficultySelectionBar
                    difficulties={filteredDifficulties}
                    selectedDifficulty={selectedDifficulty}
                    onSelectDifficulty={setSelectedDifficulty}
                    currentGameMode={gameMode}
                  />

                  {gameMode !== GameMode.Standard &&
                    nativeDifficulties.length > 0 &&
                    convertedDifficulties.length > 0 && (
                      <Typography
                        variant="caption"
                        sx={{ mt: 1, color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {t("beatmap.showing_diffs")} {nativeDifficulties.length}{" "}
                        {t("beatmap.native_diffs")}{" "}
                        {convertedDifficulties.length}{" "}
                        {t("beatmap.converted_diffs")}
                      </Typography>
                    )}
                </>
              ) : (
                <Typography color="white" fontStyle="italic">
                  {t("beatmap.not_diffs_available")}
                </Typography>
              )}
              <Typography
                variant="h6"
                sx={{ mt: 1, color: "rgba(255, 255, 255, 0.7)" }}
              >
                {selectedDifficulty?.name}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
