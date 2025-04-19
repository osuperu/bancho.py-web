import { Box, Button, Paper, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

import { BeatmapDetails, formatTime } from "../../adapters/bpy-api/beatmaps"

export const BeatmapInfo = ({
  beatmap,
}: {
  beatmap: BeatmapDetails | null
}) => {
  const { t } = useTranslation()
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        background: "#191527",
      }}
    >
      <Typography variant="h6" sx={{ pb: 1 }}>
        {t("beatmap.beatmap_info")}
      </Typography>

      <Stack spacing={1.5}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t("beatmap.source")}:
          </Typography>
          <Typography variant="body2" color="white">
            {beatmap?.source || "Original"}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t("beatmap.bpm")}:
          </Typography>
          <Typography variant="body2" color="white">
            {beatmap?.bpm}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t("beatmap.length")}:
          </Typography>
          <Typography variant="body2" color="white">
            {formatTime(beatmap?.length)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t("beatmap.submitted")}:
          </Typography>
          <Typography variant="body2" color="white">
            {beatmap?.dateSubmitted || "N/A"}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t("beatmap.ranked")}:
          </Typography>
          <Typography variant="body2" color="white">
            {beatmap?.dateRanked || "N/A"}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t("beatmap.favorites")}:
          </Typography>
          <Typography variant="body2" color="white">
            {beatmap?.favoriteCount?.toLocaleString() || "N/A"}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
            {t("beatmap.passes")}:
          </Typography>
          <Typography variant="body2" color="white">
            {beatmap?.passCount?.toLocaleString() || "N/A"}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundImage:
              "linear-gradient(90.09deg, #387EFC -0.08%, #C940FD 99.3%)",
            color: "white",
            textTransform: "none",
            borderRadius: 3,
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          Download
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "rgba(255, 255, 255, 0.3)",
            textTransform: "none",
            borderRadius: 3,
            "&:hover": {
              borderColor: "white",
              bgcolor: "rgba(255, 255, 255, 0.05)",
            },
          }}
        >
          Play
        </Button>
      </Stack>
    </Paper>
  )
}
