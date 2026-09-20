import axios from "axios";
import { handleAuthError } from "./authErrorHandler";
import { API_URL } from "../config/api";

export default async function fetchRecord({ url, id }: any) {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(
      `${API_URL}/${url}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}