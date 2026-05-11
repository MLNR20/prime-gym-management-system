import { useEffect, useState } from "react";
import axios from "axios";

interface FetchProps {
  url: string;
  page?: number;
  limit?: number;
  search?: string;
}

export default function useFetchData({
  url,
  page,
  limit,
  search,
}: FetchProps) {
  const [data, setData] = useState<any>({ data: [], meta: {} });

  const retrieveToken = localStorage.getItem("token");

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/${url}`,
          {
            params: {
              page,
              limit,
              search,
            },
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

    retrieveData();
  }, [url, page, limit, search]);
  return data;
}