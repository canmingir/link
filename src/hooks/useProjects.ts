import http from "../http";
import useApi from "./useApi";

import { useCallback, useState } from "react";

function useProjects() {
  const [projects, setProjects] = useState<
    {
      id: string;
      name: string;
      icon?: string;
      organization?: { name?: string };
      [key: string]: unknown;
    }[]
  >([]);
  const { loading, error, handleResponse } = useApi();

  const getProjects = useCallback(
    () => {
      handleResponse(http.get("/projects"), (response) => {
        setProjects(
          response.data as {
            id: string;
            name: string;
            icon?: string;
            organization?: { name?: string };
            [key: string]: unknown;
          }[]
        );
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    projects,
    loading,
    error,
    getProjects,
  };
}

export default useProjects;
