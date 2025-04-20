import {
  Avatar,
  Box,
  Container,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import moment from "moment"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useParams } from "react-router-dom"

import { getScore, GetScoreResponse } from "../adapters/bpy-api/scores"
import { GradeAIcon } from "../components/images/grade-icons/GradeAIcon"
import { GradeBIcon } from "../components/images/grade-icons/GradeBIcon"
import { GradeCIcon } from "../components/images/grade-icons/GradeCIcon"
import { GradeDIcon } from "../components/images/grade-icons/GradeDIcon"
import { GradeSHIcon } from "../components/images/grade-icons/GradeSHIcon"
import { GradeSIcon } from "../components/images/grade-icons/GradeSIcon"
import { GradeXHIcon } from "../components/images/grade-icons/GradeXHIcon"
import { GradeXIcon } from "../components/images/grade-icons/GradeXIcon"
import { ModIcon } from "../components/ModIcon"
// import { WatchReplayIcon } from "../components/images/icons/WatchReplayIcon"
import { formatNumber } from "../utils/formatting"
import { getIndividualMods } from "../utils/mods"

const GradeIcon = ({
  variant,
}: {
  variant: "XH" | "X" | "SH" | "S" | "A" | "B" | "C" | "D" | "F"
}) => {
  switch (variant) {
    case "XH":
      return <GradeXHIcon />
    case "X":
      return <GradeXIcon />
    case "SH":
      return <GradeSHIcon />
    case "S":
      return <GradeSIcon />
    case "A":
      return <GradeAIcon />
    case "B":
      return <GradeBIcon />
    case "C":
      return <GradeCIcon />
    case "D":
      return <GradeDIcon />
    // TODO: we need an F rank icon
    default:
      return <GradeDIcon />
  }
}

const ScoreMetricDisplay = ({
  metric,
  value,
  color,
}: {
  metric: string
  value: number | string
  color: string
}) => {
  return (
    <Stack direction="row" gap={1}>
      <Typography
        variant="h6"
        fontWeight="lighter"
        px={2}
        borderRadius={1337}
        bgcolor={color}
      >
        {metric}
      </Typography>
      <Typography variant="h6" fontWeight={800}>
        {value}
      </Typography>
    </Stack>
  )
}

/*const CircularDivider = () => {
  return <Box width={6} height={6} borderRadius="50%" bgcolor="white" />
}*/

export const ScorePage = () => {
  const { t } = useTranslation()

  const [scoreData, setScoreData] = useState<GetScoreResponse | null>(null)
  const queryParams = useParams()

  const scoreId = parseInt(queryParams["scoreId"] || "0")

  useEffect(() => {
    ;(async () => {
      let scoreData
      try {
        scoreData = await getScore({ id: scoreId })
      } catch (e: any) {
        console.log(e)
        throw new Error(e)
      }
      setScoreData(scoreData)
    })()
  }, [scoreId])

  if (scoreData === null) {
    return <></>
  }

  return (
    <Box>
      <Box
        pt={{ xs: 0, sm: 10 }}
        py={3}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `url(https://assets.ppy.sh/beatmaps/${scoreData.score.beatmap.beatmapsetId}/covers/cover.jpg)`,
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
              backgroundImage: `linear-gradient(90deg, rgba(15, 19, 38, 0.9) 0%, rgba(15, 19, 38, 0) 100%), url(https://assets.ppy.sh/beatmaps/${scoreData.score.beatmap.beatmapsetId}/covers/cover.jpg)`,
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
                  {scoreData.score.beatmap.artist} -{" "}
                  {scoreData.score.beatmap.title}
                </Typography>
                {/*
                <Stack direction={{ xs: "column", sm: "row" }}>
                  <Typography variant="h6">mapped by&nbsp;</Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {mapper}
                  </Typography>
                </Stack>
                */}
              </Stack>
              <Stack direction="row">
                {/* There is supposed to be a bubble here
                    that displays the star rating of the map
                    but it is not supported by our API yet */}
                <Typography variant="h6">
                  {scoreData.score.beatmap.version}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="column" justifyContent="space-around" px={3}>
                <Stack direction="column">
                  <Typography variant="h3" fontWeight="lighter">
                    {formatNumber(scoreData.score.score)}
                  </Typography>
                  <Stack direction="row" spacing={0.75}>
                    {getIndividualMods(scoreData.score.mods).map((mod) => (
                      <ModIcon key={mod} variant={mod} width={43} height={30} />
                    ))}
                  </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack direction="row">
                    {/* TODO: tooltip for exact pp amount */}
                    <Tooltip title={scoreData.score.pp}>
                      <Typography variant="h4" fontWeight="medium">
                        {Math.round(scoreData.score.pp)}
                      </Typography>
                    </Tooltip>
                    <Typography variant="h4" fontWeight="lighter">
                      pp
                    </Typography>
                  </Stack>
                  {/* <CircularDivider /> */}
                  {/* TODO: add this to the API response */}
                  {/* <Typography variant="h4">#N/A</Typography> */}
                </Stack>
              </Stack>
              <Box width={284} height={205}>
                <GradeIcon variant={scoreData.score.rank} />
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box bgcolor="#FFBD3B99" width="100%" height={2} />
      <Box
        width="100%"
        bgcolor="#211D35"
        color="#FFFFFF80"
        /* NOTE: increase zindex here to put the profile graph below this */
        position="relative"
        zIndex={2}
      >
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            gap={1.5}
            p={1}
            color="white"
          >
            <Link
              to={`/u/${scoreData.score.userId}`}
              // eslint-disable-next-line react/forbid-component-props
              style={{
                color: "#FFFFFF",
                textDecoration: "none",
              }}
            >
              <Stack direction="row" gap={1} alignItems="center">
                <Avatar
                  alt="score-user-avatar"
                  src={`https://a.akatsuki.gg/${scoreData.score.userId}`}
                  sx={{ width: 55, height: 55, borderRadius: 2 }}
                />
                <Typography variant="h6">
                  {t("score.played_by")} {scoreData.score.user.username}
                </Typography>
              </Stack>
            </Link>
            <Tooltip title={moment(scoreData.score.time).format("LLLL")}>
              <Typography variant="h6" fontWeight="lighter">
                {moment(scoreData.score.time).fromNow()}
              </Typography>
            </Tooltip>
          </Stack>
        </Container>
      </Box>
      <Container>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          p={3}
          spacing={{ xs: 5, sm: 0 }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "center", sm: " flex-start" }}
            gap={4}
          >
            <ScoreMetricDisplay
              metric="300"
              value={scoreData.score.count300}
              color="#41709C"
            />
            <ScoreMetricDisplay
              metric="100"
              value={scoreData.score.count100}
              color="#489C41"
            />
            <ScoreMetricDisplay
              metric="50"
              value={scoreData.score.count50}
              color="#9F652E"
            />
            <ScoreMetricDisplay
              metric={t("score.miss")}
              value={scoreData.score.countMiss}
              color="#9C4141"
            />
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "center", sm: " flex-start" }}
            gap={4}
          >
            <ScoreMetricDisplay
              metric="accuracy"
              value={`${scoreData.score.accuracy.toFixed(2)}%`}
              color="#211D35"
            />
            <ScoreMetricDisplay
              metric="combo"
              value={`${scoreData.score.maxCombo}x`}
              color="#211D35"
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
