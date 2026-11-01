import api from "./api";
import { handleAuthError } from "./authErrorHandler";

interface RequestStructure<T = any> {
  url: string;
  id: string;
  updateData: T;
}

export default async function updateData({
  url,
  id,
  updateData,
}: RequestStructure) {
  try {
    const response = await api.put(`/${url}/${id}`, updateData);

    return response.data;
  } catch (error) {
    console.log(error);
    handleAuthError(error);
    throw error;
  }
}