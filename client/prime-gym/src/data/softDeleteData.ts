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

  console.log(retrieveToken);
  try {
    const response = await axios.patch(
      `http://localhost:3002/${url}/${id}`,
       {},
      {
        headers: {
          Authorization: `Bearer ${retrieveToken}`,
        },
      }
    );

    console.log(response)

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}