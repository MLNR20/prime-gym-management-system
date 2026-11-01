import api from "./api";
import { handleAuthError } from "./authErrorHandler";

interface RequestStructure<T = any> {
  url: string;
  id: string;
  updateData: T;
}

export default async function patchUpdateData({
  url,
  id,
  updateData,
}: RequestStructure) {
  try {
    const response = await api.patch(`/${url}/${id}`, updateData);

    return response.data;
  } catch (error) {
    console.log(error);
    handleAuthError(error);
    throw error;
  }
}