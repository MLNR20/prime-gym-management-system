import { useEffect, useState } from "react";
import axios from "axios";

interface RequestStructure<T = any> {
  url: string;
  id: string;
  updateData?: T;
}

export default function updateData({ url, id, updateData }: RequestStructure) {
  const [data, setData] = useState<any[]>([]);
  const retrieveToken = localStorage.getItem("token");

  useEffect(() => {
    const sendData = async () => {
      try {
        const response = await axios.put(
          `http://localhost:3002/${url}/${id}`,
          updateData, 
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