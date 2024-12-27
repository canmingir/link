import { useCallback, useEffect, useState } from "react";

import http from "../http";
import useApi from "./useApi";

function useSettings() {
  const [settings, setSettings] = useState([]);
  const { loading, error, handleResponse } = useApi();

  useEffect(() => {
    getSettings();
  },[])

  const getSettings = useCallback(() => {
    handleResponse(http.get("/settings"), (response) => {
    setSettings(response.data);
    });
  }, []);

  return {
    settings,
    loading,
    error,
  };
}

export default useSettings;
