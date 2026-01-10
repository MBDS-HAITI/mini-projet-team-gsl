import { useState, useEffect, useCallback, useRef } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8010/api";

export function useFetchData(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(0);

  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  });

  const refetch = useCallback(() => {
    setTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}${url}`, { ...optionsRef.current, signal });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        if (!signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (err.name !== "AbortError" && !signal.aborted) {
          setError(err.message || "An unexpected error occurred");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, trigger]);

  return { data, loading, error, refetch };
}
