import { useEffect, useState } from "react";
import axios from "axios";

interface Token {
  url: string;
}

export default function fetchData({ url }: Token) {
  const [data, setData] = useState<any[]>([]);
  const retrieveToken = localStorage.getItem("token");

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/${url}`, {
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