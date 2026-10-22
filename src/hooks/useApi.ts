import { useState } from "react";

function useApi() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleResponse = async <T>(
    promise: Promise<T>,
    callback: (response: T) => void,
    successCallback?: () => void
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await promise;
      callback(response);
      if (successCallback) {
        successCallback();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, handleResponse };
}

export default useApi;
