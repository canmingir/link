import http from "../http";
import { publish } from "@nucleoidai/react-event";
import useApi from "./useApi";
import userInstance from "../http/user";

import { useCallback, useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState({ name: "", avatarUrl: "" });
  const [users, setUsers] = useState([]);
  const { loading, error, handleResponse } = useApi();

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = useCallback(() => {
    handleResponse(userInstance.getUserDetails(), (response) =>
      setUser(response)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPermittedUsers = useCallback(() => {
    handleResponse(userInstance.getPermittedUsers(), (response) =>
      setUsers(response)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPermission = useCallback((userId) => {
    handleResponse(
      http.post("/permissions", {
        userId,
      }),
      (response) => {
        publish("PERMISSION_CREATED", { userId: response.data.id });
      }
    );
  }, []);

  const deletePermission = useCallback((userId) => {
    handleResponse(http.delete(`/permissions/${userId}`), (response) => {
      publish("PERMISSION_DELETED", { userId: response.data.id });
    });
  }, []);

  return {
    user,
    users,
    loading,
    error,
    getPermittedUsers,
    createPermission,
    deletePermission,
  };
}
