import axios from "axios";

// By the time an error reaches here the api client has already tried to
// refresh the session, so a 401 means the user really is logged out.
export function handleAuthError(error: unknown): void {
  if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  }
}
