import api from "./api";
import { handleAuthError } from "./authErrorHandler";

export default async function fetchRecord({ url, id }: any) {
  try {
    const res = await api.get(`/${url}/${id}`);

    return res.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}