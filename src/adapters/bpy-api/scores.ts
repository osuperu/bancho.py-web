import axios from "axios"

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BPY_API_BASE_URL,
})

interface GetScoreRequest {
  id: number
}

export interface GetScoreResponse {
  status: string
  score: ScoreDetails
  beatmap: BeatmapDetails
}

export interface ScoreDetails {
  id: number
  beatmapMd5: string
  score: number
  maxCombo: number
  fullCombo: boolean
  mods: number
  count300: number
  count100: number
  count50: number
  countGeki: number
  countKatu: number
  countMiss: number
  time: Date
  playMode: number
  accuracy: number
  pp: number
  rank: "XH" | "X" | "SH" | "S" | "A" | "B" | "C" | "D" | "F"
  completed: number
  userId: number
  user: {
    id: number
    username: string
    registeredOn: Date
    privileges: number
    latestActivity: Date
    country: string
  }
}

export interface BeatmapDetails {
  beatmapId: number
  beatmapsetId: number
  beatmapMd5: string
  artist: string
  title: string
  version: string
  ar: number
  od: number
  difficulty: number
  maxCombo: number
  hitLength: number
  latestUpdate: Date
}

export const getScore = async (
  request: GetScoreRequest
): Promise<GetScoreResponse> => {
  const scoreResponse = await apiInstance.get(`/v2/scores/${request.id}`, {
    params: {
      id: request.id,
    },
  })
  const userResponse = await apiInstance.get(
    `/v2/players/${scoreResponse.data.data.userid}`
  )
  const beatmapResponse = await apiInstance.get("/v1/get_map_info", {
    params: {
      md5: scoreResponse.data.data.map_md5,
    },
  })
  return {
    status: scoreResponse.data.status,
    score: {
      id: scoreResponse.data.data.id,
      beatmapMd5: scoreResponse.data.data.map_md5,
      score: scoreResponse.data.data.score,
      maxCombo: scoreResponse.data.data.max_combo,
      fullCombo: scoreResponse.data.data.perfect,
      mods: scoreResponse.data.data.mods,
      count300: scoreResponse.data.data.n300,
      count100: scoreResponse.data.data.n100,
      count50: scoreResponse.data.data.n50,
      countGeki: scoreResponse.data.data.ngeki,
      countKatu: scoreResponse.data.data.nkatu,
      countMiss: scoreResponse.data.data.nmiss,
      time: new Date(scoreResponse.data.data.play_time),
      playMode: scoreResponse.data.data.mode,
      accuracy: scoreResponse.data.data.acc,
      pp: scoreResponse.data.data.pp,
      rank: scoreResponse.data.data.grade,
      completed: scoreResponse.data.data.status >= 1 ? 1 : 0,
      userId: scoreResponse.data.data.userid,
      user: {
        id: userResponse.data.data.id,
        username: userResponse.data.data.name,
        registeredOn: new Date(userResponse.data.data.creation_time * 1000),
        privileges: userResponse.data.data.priv,
        latestActivity: new Date(userResponse.data.data.latest_activity * 1000),
        country: userResponse.data.data.country,
      },
    },
    beatmap: {
      beatmapId: beatmapResponse.data.map.id,
      beatmapsetId: beatmapResponse.data.map.set_id,
      beatmapMd5: beatmapResponse.data.map.md5,
      artist: beatmapResponse.data.map.artist,
      title: beatmapResponse.data.map.title,
      version: beatmapResponse.data.map.version,
      ar: beatmapResponse.data.map.ar,
      od: beatmapResponse.data.map.od,
      difficulty: beatmapResponse.data.map.diff,
      maxCombo: beatmapResponse.data.map.max_combo,
      hitLength: beatmapResponse.data.map.total_length,
      latestUpdate: beatmapResponse.data.map.last_update,
    },
  }
}
