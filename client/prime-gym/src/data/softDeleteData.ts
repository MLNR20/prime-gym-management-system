import axios from "axios";
import { handleAuthError } from "./authErrorHandler";

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
      `http://localhost:3002/${url}/${id}`,
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