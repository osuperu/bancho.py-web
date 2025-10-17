import axios from 'axios';

import type { Identity } from '../../context/Identity';

interface AuthenticateRequest {
  username: string;
  password: string;
  hCaptchaToken: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  hCaptchaToken: string;
}

const apiInstance = axios.create({
  baseURL: process.env.PUBLIC_APP_BPY_API_BASE_URL,
  withCredentials: true,
});

export const authenticate = async (
  request: AuthenticateRequest,
): Promise<Identity> => {
  try {
    const response = await apiInstance.post('/v2/authenticate', {
      username: request.username,
      password: request.password,
      hcaptcha_token: request.hCaptchaToken,
    });
    return {
      userId: response.data.user_id,
      username: response.data.username,
      privileges: response.data.privileges,
    };
  } catch (e: any) {
    console.log(e);
    throw new Error(e.response.data.error);
  }
};

export const register = async (request: RegisterRequest): Promise<Identity> => {
  try {
    const response = await apiInstance.post('/v2/register', {
      username: request.username,
      password: request.password,
      email: request.email,
      hcaptcha_token: request.hCaptchaToken,
    });
    return {
      userId: response.data.user_id,
      username: response.data.username,
      privileges: response.data.privileges,
    };
  } catch (e: any) {
    console.log(e);
    throw new Error(e.response.data.error);
  }
};

export const logout = async () => {
  try {
    await apiInstance.post('/v2/logout');
  } catch (e: any) {
    console.log(e);
    throw new Error(e.response.data.error);
  }
};
