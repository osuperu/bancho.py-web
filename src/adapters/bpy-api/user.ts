import axios from "axios"

import { modeToStatsIndex } from "../../scores"
import { getUserLevel } from "../../utils/level"

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BPY_API_BASE_URL,
  withCredentials: true,
})

const modeMap: Record<number, string> = {
  0: "std",
  1: "taiko",
  2: "ctb",
  3: "mania",
  4: "rx!std",
  5: "rx!taiko",
  6: "rx!ctb",
  8: "ap!std",
}

export type StatsKey = ReturnType<typeof modeToStatsIndex>

export interface UserResponse {
  id: number
  username: string
  registeredOn: Date
  privileges: number
  latestActivity: Date
  country: string
  stats: [ReturnType<typeof modeToStatsIndex>, UserStats][]
  clan: UserClan
  followers: number
  silenceInfo?: {
    reason?: string
    end?: Date
  }
  email?: string // TODO?
}

export interface UserEmailChangedResponse {
  status: string
}

export interface UserClan {
  id: number
  name: string
  tag: string
  description: string
  icon: string
  owner: number
  status: number // todo enum
}

export interface AllModeUserStats {
  std: UserStats
  taiko: UserStats
  ctb: UserStats
  mania: UserStats
}

export interface UserStats {
  rankedScore: number
  totalScore: number
  playcount: number
  playtime: number
  replaysWatched: number
  totalHits: number
  level: number
  level_progress: number
  accuracy: number
  pp: number
  globalLeaderboardRank: number | null
  countryLeaderboardRank: number | null
  maxCombo: number
  grades: UserGrades
}

export interface UserGrades {
  XHCount: number
  XCount: number
  SHCount: number
  SCount: number
  ACount: number
  BCount: number
  CCount: number
  DCount: number
}

interface UserFriendsRequest {
  page: number
  pageSize: number
}

export const fetchUser = async (userId: number): Promise<UserResponse> => {
  try {
    const userResponse = await apiInstance.get(`/v2/players/${userId}`)
    const statsResponse = await apiInstance.get(`/v2/players/${userId}/stats`)

    return {
      id: userResponse.data.data.id,
      username: userResponse.data.data.name,
      registeredOn: new Date(userResponse.data.data.creation_time * 1000),
      privileges: userResponse.data.data.priv,
      latestActivity: new Date(userResponse.data.data.latest_activity * 1000),
      country: userResponse.data.data.country,
      stats: statsResponse.data.data.map((s: any) => [
        modeMap[s.mode],
        {
          rankedScore: s.rscore,
          totalScore: s.tscore,
          playcount: s.plays,
          playtime: s.playtime,
          replaysWatched: s.replay_views,
          totalHits: s.total_hits,
          level: getUserLevel(s.tscore).level,
          level_progress: getUserLevel(s.tscore).progress,
          accuracy: s.acc,
          pp: s.pp,
          maxCombo: s.max_combo,
          grades: {
            XHCount: s.xh_count,
            XCount: s.x_count,
            SHCount: s.sh_count,
            SCount: s.s_count,
            ACount: s.a_count,
          },
        },
      ]),
      clan: {
        // TODO
        id: 1,
        name: "Test",
        tag: "[Test]",
        description: "Test",
        icon: "",
        owner: 3,
        status: 0,
      },
      followers: 0, // TODO
      silenceInfo: {
        reason: "Test",
        end: new Date(userResponse.data.data.silence_end),
      },
      // TODO?
      email: "test@test.com",
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.userResponse.data.error)
  }
}

/**
 * 
  /v2/players/friends
 */
export const fetchUsersFriends = async (
  request: UserFriendsRequest
): Promise<UserResponse[]> => {
  const response = await apiInstance.get(`/v2/players/friends`, {
    params: {
      page: request.page,
      page_size: request.pageSize,
    },
  })

  return response.data.data.map((user: any) => ({
    id: user.id,
    username: user.name,
    registeredOn: new Date(user.creation_time * 1000),
    privileges: user.priv,
    latestActivity: new Date(user.latest_activity * 1000),
    country: user.country,
    stats: [],
    clan: {
      id: 1,
      name: "Test",
      tag: "[Test]",
      description: "Test",
      icon: "",
      owner: 3,
      status: 0,
    },
    followers: 0, // TODO
    silenceInfo: {
      reason: "Test",
      end: new Date(user.silence_end),
    },
    email: "test@test.com", // TODO
  }))
}

export const updateUsername = async (
  userId: number,
  currentPassword: string,
  newUsername: string
): Promise<UserEmailChangedResponse> => {
  try {
    const response = await apiInstance.put(`/v2/players/${userId}/username`, {
      current_password: currentPassword,
      new_username: newUsername,
    })

    return {
      status: response.data.status,
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.error)
  }
}

export const updateEmail = async (
  userId: number,
  currentPassword: string,
  newEmail: string
): Promise<UserEmailChangedResponse> => {
  try {
    const response = await apiInstance.put(`/v2/players/${userId}/email`, {
      current_password: currentPassword,
      new_email: newEmail,
    })

    return {
      status: response.data.status,
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.error)
  }
}

export const updatePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<UserEmailChangedResponse> => {
  try {
    const response = await apiInstance.put(`/v2/players/${userId}/password`, {
      current_password: currentPassword,
      new_password: newPassword,
    })

    return {
      status: response.data.status,
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.error)
  }
}

export const fetchTotalRegisteredUsers = async (): Promise<number> => {
  const registeredUsersResponse = await apiInstance.get("/v2/players")

  return registeredUsersResponse.data.meta.total
}
