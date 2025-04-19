import axios from "axios"

interface SearchRequest {
  query: string
}

export interface SingleUserSearchResult {
  id: number
  username: string
}

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BPY_API_BASE_URL,
})

export interface SearchResponse {
  code: string
  users: SingleUserSearchResult[] | null
}

export const searchUsers = async (
  request: SearchRequest
): Promise<SearchResponse> => {
  try {
    const response = await apiInstance.get("/v1/search_players", {
      params: {
        q: request.query,
      },
    })
    return {
      code: response.data.status,
      users:
        response.data.result?.map((user: any) => ({
          id: user.id,
          username: user.name,
        })) ?? null,
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.user_feedback)
  }
}
