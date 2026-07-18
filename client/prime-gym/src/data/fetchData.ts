import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { handleAuthError } from "./authErrorHandler";

interface FetchProps {
  url: string;
  page?: number;
  limit?: number;
  search?: string;
}

// Bounds for the adaptive re-sync delay: the next sync is scheduled at a
// multiple of how long the last request actually took, instead of a fixed
// polling interval, so fast endpoints resync quickly and slow ones back off.
const MIN_SYNC_DELAY_MS = 5000;
const MAX_SYNC_DELAY_MS = 60000;
const SYNC_DELAY_MULTIPLIER = 3;

function getNextSyncDelay(elapsedMs: number) {
  return Math.min(
    MAX_SYNC_DELAY_MS,
    Math.max(MIN_SYNC_DELAY_MS, elapsedMs * SYNC_DELAY_MULTIPLIER)
  );
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
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const controller = new AbortController();

    const retrieveData = async () => {
      const startedAt = performance.now();
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
            signal: controller.signal,
          }
        );

        if (cancelled) return;
        setData(response.data);
      } catch (error) {
        if (cancelled || axios.isCancel(error)) return;
        console.log(error);
        handleAuthError(error);
      } finally {
        if (!cancelled) {
          const elapsed = performance.now() - startedAt;
          timeoutId = setTimeout(retrieveData, getNextSyncDelay(elapsed));
        }
      }
    };

    retrieveData();

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [url, page, limit, search]);
  return data;
}

export function useFetchDataWithStatus({
  url,
  page,
  limit,
  search,
}: FetchProps) {
  const [data, setData] = useState<any>({ data: [], meta: {} });
  const [loading, setLoading] = useState(true);
  const isFirstFetch = useRef(true);

  const retrieveToken = localStorage.getItem("token");

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    isFirstFetch.current = true;

    const retrieveData = async () => {
      if (isFirstFetch.current) setLoading(true);
      const startedAt = performance.now();
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
            signal: controller.signal,
          }
        );

        if (cancelled) return;
        setData(response.data);
      } catch (error) {
        if (cancelled || axios.isCancel(error)) return;
        console.log(error);
        handleAuthError(error);
      } finally {
        if (!cancelled) {
          if (isFirstFetch.current) {
            setLoading(false);
            isFirstFetch.current = false;
          }
          const elapsed = performance.now() - startedAt;
          timeoutId = setTimeout(retrieveData, getNextSyncDelay(elapsed));
        }
      }
    };

    retrieveData();

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [url, page, limit, search]);

  return { data, loading };
}
