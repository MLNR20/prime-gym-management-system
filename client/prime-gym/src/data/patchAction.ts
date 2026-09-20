import axios from "axios";
import { handleAuthError } from "./authErrorHandler";
import { API_URL } from "../config/api";

interface Params {
  url: string;
  id: string;
  action: string;
}

export default async function patchAction({ url, id, action }: Params) {
  const retrieveToken = localStorage.getItem("token");

  try {
    const response = await axios.patch(
      `${API_URL}/${url}/${id}/${action}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${retrieveToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    handleAuthError(error);
    throw error;
  }
}
