import axios from "axios";

interface RequestStructure<T = any> {
  url: string;
  data?: T;
}

export default async function createData({url, data}: RequestStructure) {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `http://localhost:3002/${url}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}