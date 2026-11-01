import api from "./api";
import { handleAuthError } from "./authErrorHandler";

interface Token {
  url: string;
  id: string;
}

export default async function softDeleteData({
  url,
  id,
}: Token) {
  try {
    const response = await api.patch(`/${url}/${id}`, {});

    return response.data;
  } catch (error) {
    console.log(error);
    handleAuthError(error);
    throw error;
  }
}