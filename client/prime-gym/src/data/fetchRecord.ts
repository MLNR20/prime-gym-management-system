import axios from "axios";
import { handleAuthError } from "./authErrorHandler";

export default async function fetchRecord({ url, id }: any) {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(
      `http://localhost:3002/${url}/${id}`,
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