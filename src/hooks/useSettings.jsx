import http from "../http";
import useApi from "./useApi";

import { publish, useEvent } from "@nucleoidai/react-event";
import { useCallback, useEffect, useState } from "react";

function useSettings(id) {
  const [settings, setSettings] = useState([]);
  const { loading, error, handleResponse } = useApi();
  const [settingUpdated] = useEvent("SETTING_UPDATED", null);

  useEffect(() => {
    if (id) {
      getSettings(id);
    }
  }, [settingUpdated]);

  const getSettings = useCallback(
    (id) => {
      handleResponse(http.get(`/projects/${id}/settings`), (response) => {
        setSettings(response.data);
      });
    },
    [handleResponse]
  );

  const updateSettings = useCallback(
    (id, newSettings) => {
      handleResponse(
        http.patch(`/projects/${id}/settings`, { settings: newSettings }),
        () => {
          publish("SETTING_UPDATED", { id });
        }
      );
    },
    [handleResponse, getSettings]
  );

  return {
    settings,
    loading,
    error,
    updateSettings,
  };
}

export default useSettings;
