import axios from "axios";

export default async function fetchRecord({ url, id }: any) {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `http://localhost:3002/${url}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}