import { useState } from "react";

function useApi() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleResponse = async (promise, callback, successCallback) => {
    setLoading(true);
    setError(null);
    try {
      const response = await promise;
      callback(response);
      if (successCallback) {
        successCallback();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, handleResponse };
}

export default useApi;
