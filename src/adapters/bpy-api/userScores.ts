import axios from "axios"

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BPY_API_BASE_URL,
})

interface UserScoresRequest {
  scope: "best" | "recent"
  mode: number
  limit: number
  page: number
  id: number
}

export interface UserScoresResponse {
  status: string
  scores: UserScore[] | null
}

export interface UserScore {
  id: string
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
  rank: string
  completed: number
  pinned: boolean
  beatmap: UserScoreBeatmap
  userId: number
}

export interface UserScoreBeatmap {
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
  latestUpdate: string
}

export const fetchUserScores = async (
  request: UserScoresRequest
): Promise<UserScoresResponse> => {
  try {
    const response = await apiInstance.get(`/v1/get_player_scores`, {
      params: {
        scope: request.scope,
        mode: request.mode,
        page: request.page,
        iimit: request.limit,
        id: request.id,
      },
    })
    return {
      status: response.data.status,
      scores:
        response.data.scores?.map((score: any) => ({
          id: score.id,
          beatmapMd5: score.beatmap.md5,
          score: score.score,
          maxCombo: score.max_combo,
          fullCombo: score.beatmap.max_combo,
          mods: score.mods,
          count300: score.n300,
          count100: score.n100,
          count50: score.n50,
          countGeki: score.ngeki,
          countKatu: score.nkatu,
          countMiss: score.nmiss,
          time: new Date(score.play_time),
          playMode: score.mode,
          accuracy: score.acc,
          pp: score.pp,
          rank: 1, // TODO
          completed: 0, // TODO
          beatmap: {
            beatmapId: score.beatmap.id,
            beatmapsetId: score.beatmap.set_id,
            beatmapMd5: score.beatmap.md5,
            artist: score.beatmap.artist,
            title: score.beatmap.title,
            version: score.beatmap.version,
            ar: score.beatmap.ar,
            od: score.beatmap.od,
            difficulty: score.beatmap.diff,
            maxCombo: score.beatmap.max_combo,
            hitLength: score.beatmap.total_length,
            latestUpdate: score.beatmap.last_update,
          },
          userId: response.data.id,
        })) ?? null,
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}
