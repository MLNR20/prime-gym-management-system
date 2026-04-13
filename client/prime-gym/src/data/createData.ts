import { useEffect, useState } from "react";
import axios from "axios";

interface RequestStructure<T = any> {
  url: string;
  createData?: T;
}

export default function createData({ url, createData }: RequestStructure) {
  const [data, setData] = useState<any[]>([]);
  const retrieveToken = localStorage.getItem("token");

  useEffect(() => {
    const sendData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3002/${url}`,
          createData, // ✅ request body
          {
            headers: {
              Authorization: `Bearer ${retrieveToken}`,
            },
          }
        );

        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    sendData();
  }, []);

  return data;
}