import api from "./api";
import { handleAuthError } from "./authErrorHandler";

interface Params {
  url: string;
  id: string;
  action: string;
}

export default async function patchAction({ url, id, action }: Params) {
  try {
    const response = await api.patch(`/${url}/${id}/${action}`, {});

    return response.data;
  } catch (error) {
    console.log(error);
    handleAuthError(error);
    throw error;
  }
}
