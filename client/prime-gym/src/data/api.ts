import axios, { type InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../config/api";

// Auth lives in httpOnly cookies set by the server, so the browser attaches
// them itself; JS never sees (or stores) a token. withCredentials is what
// lets those cookies travel on cross-origin requests.
const api = axios.create({ baseURL: API_URL, withCredentials: true });

// All requests that find the access token expired share one refresh call,
// because the refresh token is single-use and rotates on every call.
let refreshInFlight: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = axios
      .post(`${API_URL}/auth/refresh`, null, { withCredentials: true })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config: RetryableConfig | undefined = error?.config;
    const isAuthRoute = config?.url?.startsWith("/auth/");

    if (error?.response?.status === 401 && config && !config._retried && !isAuthRoute) {
      config._retried = true;
      if (await refreshSession()) return api(config);
    }
    return Promise.reject(error);
  }
);

// fetch() equivalent for the few call sites that don't use axios: same
// cookies, same refresh-and-retry on 401.
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const send = () => fetch(`${API_URL}${path}`, { ...init, credentials: "include" });

  const response = await send();
  if (response.status === 401 && (await refreshSession())) return send();
  return response;
}

export default api;
