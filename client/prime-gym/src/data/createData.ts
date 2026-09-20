import axios from "axios";
import { handleAuthError } from "./authErrorHandler";
import { API_URL } from "../config/api";

interface RequestStructure<T = any> {
  url: string;
  data?: T;
}

export default async function createData({url, data}: RequestStructure) {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${API_URL}/${url}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
}