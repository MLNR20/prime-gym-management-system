import api from "./api";
import { handleAuthError } from "./authErrorHandler";

export default async function deleteData({ url, id,}: {url: string; id: string;})
{
  try {
    const response = await api.delete(`/${url}/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
}
