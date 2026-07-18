import axios from "axios";

export function handleAuthError(error: unknown): void {
  if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
    localStorage.removeItem("token");

    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  }
}
