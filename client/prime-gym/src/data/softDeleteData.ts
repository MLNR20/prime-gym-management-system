import { useEffect, useState } from "react";
import axios from "axios";

interface Token {
  url: string;
  id: string;
}

export default function softDeleteData({ url, id }: Token) {
  const [data, setData] = useState<any[]>([]);
  const retrieveToken = localStorage.getItem("token");

  useEffect(() => {
    const softDeleteData = async () => {
      try {
        const response = await axios.delete(`http://localhost:3002/${url}/${id}`, {
          headers: {
            Authorization: `Bearer ${retrieveToken}`,
          },
        });

        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    softDeleteData();
  }, []);

  return data;
}