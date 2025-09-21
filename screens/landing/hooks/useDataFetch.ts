import { useState, useEffect } from "react";

export const useDataFetch = (fetchFunction: () => Promise<any>, key: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchFunction();
        setData(result);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchFunction, key]);

  const refetch = async () => {
    try {
      setLoading(true);
      const cache = (global as any).cache; 
      cache.clear(key);
      const result = await fetchFunction();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};