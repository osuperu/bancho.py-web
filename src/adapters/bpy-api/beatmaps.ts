import axios from "axios"

import { GameMode } from "../../GameModes"

export interface Difficulty {
  id: number
  name: string
  stars: number
  creator: string
  bpm: number
  circleCount: number
  sliderCount: number
  spinnerCount: number
  gameMode: GameMode
}

export interface BeatmapDetails {
  id: number
  setId: number
  artist: string
  title: string
  creator: string
  source: string
  coverUrl: string
  audioUrl: string
  previewTime: number
  length: number
  bpm: number
  playCount: number
  favoriteCount: number
  passCount: number
  dateSubmitted: string
  dateRanked: string
  difficulties: Difficulty[]
}

export interface LeaderboardDetails {
  id: number
  playerId: number
  name: string
  country: string
  tScore: number
  pp: number
  acc: number
  maxCombo: number
  mods: number
}

export interface GetBeatmapSetResponse {
  status: string
  beatmap: BeatmapDetails[]
}

export interface GetBeatmapLeaderboardResponse {
  status: string
  leaderboard: LeaderboardDetails[] | null
}

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BPY_API_BASE_URL,
})

export const getBeatmapSet = async (
  id: number
): Promise<GetBeatmapSetResponse> => {
  const beatmapResponse = await apiInstance.get("/v1/get_map_info", {
    params: {
      id: id,
    },
  })

  const beatmapSetResponse = await apiInstance.get("/v2/maps", {
    params: {
      set_id: beatmapResponse.data.map.set_id,
    },
  })

  return {
    status: beatmapSetResponse.data.status,
    beatmap: beatmapSetResponse.data.data?.map((beatmap: any) => ({
      id: beatmap.id,
      setId: beatmap.set_id,
      artist: beatmap.artist,
      title: beatmap.title,
      creator: beatmap.creator,
      source: "", // API doesn't provide this field
      coverUrl: `https://assets.ppy.sh/beatmaps/${beatmap.set_id}/covers/cover.jpg`,
      audioUrl: "", // API doesn't provide this field
      previewTime: 0, // API doesn't provide this field
      length: beatmap.total_length,
      bpm: beatmap.bpm,
      playCount: beatmap.plays,
      favoriteCount: 0, // API doesn't provide this field
      passCount: beatmap.passes,
      dateSubmitted: "", // API doesn't provide this field
      dateRanked: beatmap.last_update.split("T")[0],
      difficulties: beatmapSetResponse.data.data.map((diff: any) => ({
        id: diff.id,
        name: diff.version,
        stars: diff.diff,
        creator: diff.creator,
        bpm: diff.bpm,
        circleCount: 0, // API doesn't provide this field
        sliderCount: 0, // API doesn't provide this field
        spinnerCount: 0, // API doesn't provide this field
        gameMode: diff.mode,
      })),
    })),
  }
}

export const getBeatmapLeaderboard = async (
  beatmapId: number,
  mode: number
): Promise<GetBeatmapLeaderboardResponse> => {
  const response = await apiInstance.get("/v1/get_map_scores", {
    params: {
      scope: "best",
      id: beatmapId,
      mode: mode,
    },
  })

  return {
    status: response.data.status,
    leaderboard:
      response.data.scores?.map((score: any) => ({
        id: score.id,
        playerId: score.userid,
        name: score.player_name,
        country: score.player_country,
        tScore: score.score,
        pp: score.pp,
        acc: score.acc,
        maxCombo: score.max_combo,
        mods: score.mods,
      })) ?? null,
  }
}

export const formatTime = (seconds: number | undefined): string => {
  if (seconds === undefined) {
    return "0:00"
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}
