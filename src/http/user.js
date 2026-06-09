import axios from "axios";
import config from "../config/config.js";
import http from "./index";
import { jwtDecode } from "jwt-decode";
import oauth from "./oauth";
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
    const refreshToken = await storage.get("link", "refreshToken");

    if (!refreshToken) {
      console.log("No refresh token found");
      return null;
    }

    let accessToken = await storage.get("link", "accessToken");

    if (!accessToken) {
      console.log("No access token found");
      return null;
    }

    try {
      const decodedToken = jwtDecode(accessToken);
      const isExpired = decodedToken.exp * 1000 < Date.now();

      if (isExpired) {
        console.log(
          "Access token expired, refreshing before fetching user details...",
        );
        const { appId } = config();
        const projectId = storage.get("projectId");
        const identityProvider = storage.get("link", "identityProvider");

        const { data } = await oauth.post("/oauth", {
          refreshToken,
          appId,
          projectId,
          identityProvider,
          ...(identityProvider === "DEMO" && {
            username: "admin",
            password: "admin",
          }),
        });

        accessToken = data.accessToken;
        storage.set("link", "accessToken", accessToken);
        console.log(
          "Access token refreshed successfully, now fetching user details",
        );
      }
    } catch (error) {
      console.error("Error checking or refreshing token:", error);
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

    console.log("No user data received from server");
    return null;
  } catch (error) {
    console.error("Error fetching user details from server:", error);
    return null;
  }
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

instance.getPermittedUsers = async () => {
  const { appId } = config();
  const projectId = storage.get("projectId");
  const refreshToken = await storage.get("link", "refreshToken");

  const response = await http.get("/permissions");

  const uniqueUserIds = [
    ...new Set(
      response.data
        .filter((p) => p.appId === appId && p.projectId === projectId)
        .map((p) => p.userId),
    ),
  ];

  const results = await Promise.allSettled(
    uniqueUserIds.map(async (userId) => {
      if (UUID_REGEX.test(userId)) {
        return { id: userId, name: userId, avatarUrl: "" };
      }
      const userResponse = await http.get("/oauth/user", {
        headers: { "X-Refresh-Token": refreshToken },
        params: { userId },
      });
      return userResponse.data.user;
    }),
  );

  return results.filter((r) => r.status === "fulfilled").map((r) => r.value);
};

export default instance;
