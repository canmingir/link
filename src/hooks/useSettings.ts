import http from "../http";
import useApi from "./useApi";

import { publish, useEvent } from "@nucleoidai/react-event";
import { useCallback, useEffect, useState } from "react";

function useSettings(id?: string) {
  const [settings, setSettings] = useState<{ timeZone: string }>({
    timeZone: "",
  });
  const { loading, error, handleResponse } = useApi();
  const [settingUpdated] = useEvent("SETTING_UPDATED", null);

  useEffect(
    () => {
      if (id) {
        getSettings(id);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settingUpdated]
  );

  const getSettings = useCallback(
    (id: string) => {
      handleResponse(http.get(`/projects/${id}/settings`), (response) => {
        setSettings(response.data as { timeZone: string });
      });
    },
    [handleResponse]
  );

  const updateSettings = useCallback(
    (id: string, newTimeZone: string) => {
      handleResponse(
        http.patch(`/projects/${id}/settings`, {
          timeZone: newTimeZone,
        }),
        () => {
          publish("SETTING_UPDATED", { id });
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
