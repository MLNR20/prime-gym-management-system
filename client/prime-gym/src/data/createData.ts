import api from "./api";
import { handleAuthError } from "./authErrorHandler";

interface RequestStructure<T = any> {
  url: string;
  data?: T;
}

export default async function createData({url, data}: RequestStructure) {
  try {
    const response = await api.post(`/${url}`, data);

    return response.data;
  } catch (error) {
    console.error(error);
    handleAuthError(error);
    throw error;
  }
}