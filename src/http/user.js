import axios from "axios";
import config from "../config/config.js";
import http from "./index";
import { jwtDecode } from "jwt-decode";
import { storage } from "@nucleoidjs/webstorage";

const instance = axios.create({
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

instance.interceptors.request.use(async (request) => {
  const refreshToken = await storage.get("link", "refreshToken");
  if (refreshToken) {
    request.headers["Authorization"] = `Bearer ${refreshToken}`;
  }
  return request;
});

instance.getUserDetails = async () => {
  try {
    const refreshToken = storage.get("link", "refreshToken");

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
  const projectId = storage.get("projectId");
  const identityProvider = storage.get("link", "identityProvider");

  const response = await http.get("/permissions");

  const uniqueUserIds = [
    ...new Set(
      response.data
        .filter((p) => p.appId === appId && p.projectId === projectId)
        .map((p) => p.userId)
    ),
  ];

  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (identityProvider?.toUpperCase() === "GITHUB") {
    const results = await Promise.allSettled(
      uniqueUserIds.map(async (userId) => {
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
      .filter((r) => r.status === "fulfilled" && r.value !== null)
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
    const accessToken = await storage.get("link", "accessToken");
    let currentUserId = null;

    try {
      const decoded = jwtDecode(accessToken);
      currentUserId = decoded.sub;
    } catch (_) {}

    return uniqueUserIds
      .filter((id) => !UUID_REGEX.test(id))
      .map((id) => ({
        id: String(id),
        identityProvider: "COGNITO",
        name: id === currentUserId ? "You" : "Cognito User",
        displayName: id === currentUserId ? "Cognito Admin" : null,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${id}`,
        email: null,
      }));
  }

  return [];
};

export default instance;
