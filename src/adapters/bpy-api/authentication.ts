import axios from "axios"

import type { Identity } from "../../context/Identity"

interface AuthenticateRequest {
  username: string
  password: string
}

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BPY_API_BASE_URL,
  withCredentials: true,
})

export const authenticate = async (
  request: AuthenticateRequest
): Promise<Identity> => {
  try {
    const response = await apiInstance.post("/v2/authenticate", request)
    return {
      userId: response.data.user_id,
      username: response.data.username,
      privileges: response.data.privileges,
    }
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.error)
  }
}

export const logout = async () => {
  try {
    await apiInstance.post("/v2/logout")
  } catch (e: any) {
    console.log(e)
    throw new Error(e.response.data.error)
  }
}
