import http from "../http";
import useApi from "./useApi";

import { useCallback, useState } from "react";

function useProjects() {
  const [projects, setProjects] = useState([]);
  const { loading, error, handleResponse } = useApi();

  const getProjects = useCallback(() => {
    handleResponse(http.get("/projects"), (response) => {
      setProjects(response.data);
    });
  }, []);

  return {
    projects,
    loading,
    error,
    getProjects,
  };
}

export default useProjects;
