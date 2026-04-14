import axios from "axios";

export default async function deleteData({ url, id,}: {url: string; id: string;}) 
{
  const token = localStorage.getItem("token");

  try {
    const response = await axios.delete(`http://localhost:3002/${url}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
