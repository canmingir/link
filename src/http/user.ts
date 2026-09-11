import config from "../config/config";
import http from "./index";
import { jwtDecode } from "jwt-decode";
import { storage } from "@nucleoidjs/webstorage";

import axios, { AxiosInstance } from "axios";

type UserRecord = {
  id: string;
  identityProvider: string;
  name: string;
  displayName: string | null;
  avatarUrl: string | null;
  email: string | null;
};

type PermissionRecord = {
  appId: string;
  projectId: string;
  userId: string;
};

type UserInstance = AxiosInstance & {
  getUserDetails: () => Promise<UserRecord | null>;
  getPermittedUsers: () => Promise<UserRecord[]>;
};

const instance = axios.create({
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
}) as UserInstance;

instance.interceptors.request.use(async (request) => {
  const refreshToken = await storage.get("link", "refreshtoken");
  if (refreshToken) {
    request.headers["Authorization"] = `Bearer ${refreshToken}`;
  }
  return request;
});

instance.getUserDetails = async () => {
  try {
    const refreshToken = storage.get("link", "refreshtoken");

    if (!refreshToken) {
      return null;
    }

    const response = await http.get("/oauth/user", {
      headers: {
        "X-Refresh-Token": refreshToken,
      },
    });

    if (response.data && response.data.user) {
      return response.data.user;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user details from server:", error);
    return null;
  }
};

instance.getPermittedUsers = async () => {
  const { appId } = config();
  const projectId = storage.get("link", "projectid");
  const identityProvider = storage.get("link", "identityprovider");

  const response = await http.get("/permissions");

  const uniqueUserIds: string[] = [
    ...new Set<string>(
      (response.data as PermissionRecord[])
        .filter((p) => p.appId === appId && p.projectId === projectId)
        .map((p) => p.userId)
    ),
  ];

  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (identityProvider?.toUpperCase() === "GITHUB") {
    const results = await Promise.allSettled(
      uniqueUserIds.map(async (userId): Promise<UserRecord> => {
        if (UUID_REGEX.test(userId)) {
          return {
            id: String(userId),
            identityProvider,
            name: String(userId),
            displayName: null,
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`,
            email: null,
          };
        }
        const { data } = await axios.get(
          `https://api.github.com/user/${userId}`,
          { headers: { Accept: "application/vnd.github+json" } }
        );
        return {
          id: String(data.id),
          identityProvider: "GITHUB",
          name: data.login,
          displayName: data.name || null,
          avatarUrl: data.avatar_url || null,
          email: data.email || null,
        };
      })
    );

    return results
      .filter(
        (r): r is PromiseFulfilledResult<UserRecord> =>
          r.status === "fulfilled" && r.value !== null
      )
      .map((r) => r.value);
  }

  if (identityProvider?.toUpperCase() === "DEMO") {
    return [
      {
        id: "1001",
        identityProvider: "DEMO",
        name: "admin",
        displayName: "Demo Admin",
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=1001`,
        email: "admin@demo.local",
      },
    ];
  }

  if (identityProvider?.toUpperCase() === "COGNITO") {
    const accessToken = await storage.get("link", "accesstoken");
    let currentUserId = null;

    try {
      const decoded = jwtDecode(accessToken as string);
      currentUserId = decoded.sub;
    } catch {
      // ignore invalid/missing access token
    }

    return uniqueUserIds
      .filter((id) => !UUID_REGEX.test(id))
      .map(
        (id): UserRecord => ({
          id: String(id),
          identityProvider: "COGNITO",
          name: id === currentUserId ? "You" : "Cognito User",
          displayName: id === currentUserId ? "Cognito Admin" : null,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${id}`,
          email: null,
        })
      );
  }

  return [];
};

export default instance;
