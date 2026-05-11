import axios from "axios";

interface Token {
  url: string;
  id: string;
}

export default async function softDeleteData({
  url,
  id,
}: Token) {
  const retrieveToken = localStorage.getItem("token");

  try {
    const response = await axios.delete(
      `http://localhost:3002/${url}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${retrieveToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}