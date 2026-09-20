import axios from "axios";
import { handleAuthError } from "./authErrorHandler";
import { API_URL } from "../config/api";

interface Token {
  url: string;
  id: string;
}

export default async function softDeleteData({
  url,
  id,
}: Token) {
  const retrieveToken = localStorage.getItem("token");

  console.log(retrieveToken);
  try {
    const response = await axios.patch(
      `${API_URL}/${url}/${id}`,
       {},
      {
        headers: {
          Authorization: `Bearer ${retrieveToken}`,
        },
      }
    );

    console.log(response)

    return response.data;
  } catch (error) {
    console.log(error);
    handleAuthError(error);
    throw error;
  }
}