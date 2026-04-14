import axios from "axios";

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
  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(
      `http://localhost:3002/${url}/${id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}