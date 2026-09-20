import axios from "axios";
import { handleAuthError } from "./authErrorHandler";
import { API_URL } from "../config/api";

export default async function deleteData({ url, id,}: {url: string; id: string;})
{
  const token = localStorage.getItem("token");

  try {
    const response = await axios.delete(`${API_URL}/${url}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
}
