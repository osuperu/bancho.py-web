import axios from "axios"

export interface LeaderboardResponse {
  status: string
  leaderboard: LeaderboardUser[]
}

export interface LeaderboardUser {
  playerId: number
  name: string
  country: string
  tScore: number
  rScore: number
  pp: number
  plays: number
  playtime: number
  acc: number
  maxCombo: number
  xhCount: number
  xCount: number
  shCount: number
  sCount: number
  aCount: number
}

interface LeaderboardRequest {
  mode: number
  sort: string
  country?: string
  page: number
  limit: number
}

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BPY_API_BASE_URL,
})

export const fetchLeaderboard = async (
  request: LeaderboardRequest
): Promise<LeaderboardResponse> => {
  try {
    const response = await apiInstance.get("/v1/get_leaderboard", {
      params: {
        mode: request.mode,
        sort: request.sort,
        country: request.country,
        limit: request.limit,
        page: request.page,
      },
    })

    return {
      status: response.data.status,
      leaderboard:
        response.data.leaderboard?.map((user: any) => ({
          playerId: user.player_id,
          name: user.name,
          country: user.country,
          tScore: user.tscore,
          rScore: user.rscore,
          pp: user.pp,
          plays: user.plays,
          playtime: user.playtime,
          acc: user.acc,
          maxCombo: user.max_combo,
          xhCount: user.xh_count,
          xCount: user.x_count,
          shCount: user.sh_count,
          sCount: user.s_count,
          aCount: user.a_count,
        })) ?? null,
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}
