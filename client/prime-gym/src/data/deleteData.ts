import { useEffect, useState } from "react";
import axios from "axios";

interface Token {
  url: string;
  id: string;
}

export default function deleteData({ url, id }: Token) {
  const [data, setData] = useState<any[]>([]);
  const retrieveToken = localStorage.getItem("token");

  useEffect(() => {
    const retrieveData = async () => {
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

    retrieveData();
  }, []);

  return data;
}