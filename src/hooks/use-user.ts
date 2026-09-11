import http from "../http";
import { publish } from "@nucleoidai/react-event";
import useApi from "./useApi";
import userInstance from "../http/user";

import { useCallback, useEffect, useState } from "react";

export type User = {
  id?: string;
  name: string;
  avatarUrl: string;
  email?: string | null;
  displayName?: string | null;
  identityProvider?: string;
  role?: string;
};

export function useUser() {
  const [user, setUser] = useState<User>({ name: "", avatarUrl: "" });
  const [users, setUsers] = useState<User[]>([]);
  const { loading, error, handleResponse } = useApi();

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = useCallback(() => {
    handleResponse(userInstance.getUserDetails(), (response) => {
      if (response) setUser(response as User);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPermittedUsers = useCallback(() => {
    handleResponse(userInstance.getPermittedUsers(), (response) =>
      setUsers(response as User[])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPermission = useCallback(
    (userId: string) => {
      handleResponse(
        http.post("/permissions", {
          userId,
        }),
        (response) => {
          publish("PERMISSION_CREATED", { userId: response.data.id });
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const deletePermission = useCallback(
    (userId: string) => {
      handleResponse(http.delete(`/permissions/${userId}`), (response) => {
        publish("PERMISSION_DELETED", { userId: response.data.id });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
