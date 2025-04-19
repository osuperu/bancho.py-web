import { Box, Grid, GridLegacy, Stack, Typography } from "@mui/material"
import type React from "react"

import type { Difficulty } from "../../adapters/bpy-api/beatmaps"

export const BeatmapStatDisplay = ({
  difficulty,
}: {
  difficulty: Difficulty
}) => {
  return (
    <Grid container spacing={2} justifyContent="space-evenly">
      {" "}
      {/** center */}
      <GridLegacy item xs={6}>
        <Box pr={2}>
          <Stack spacing={1}>
            <StatItem
              label="Star rating"
              value={`${difficulty.stars.toFixed(2)} ★`}
            />
            <StatItem label="BPM" value={difficulty.bpm} />
            <StatItem label="Creator" value={difficulty.creator} />
          </Stack>
        </Box>
      </GridLegacy>
      <GridLegacy item xs={6}>
        <Box>
          <Stack spacing={1}>
            <StatItem label="Circles" value={difficulty.circleCount} />
            <StatItem label="Sliders" value={difficulty.sliderCount} />
            <StatItem label="Spinners" value={difficulty.spinnerCount} />
          </Stack>
        </Box>
      </GridLegacy>
    </Grid>
  )
}

const StatItem = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Typography
      variant="body2"
      color="rgba(255, 255, 255, 0.5)"
      sx={{ minWidth: "80px" }}
    >
      {label}:
    </Typography>
    <Typography
      variant="body1"
      color="white"
      sx={{ textAlign: "right", flex: 1 }}
    >
      {value}
    </Typography>
  </Box>
)
