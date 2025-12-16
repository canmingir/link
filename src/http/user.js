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
          "Access token expired, refreshing before fetching user details..."
        );
        const { appId } = config();
        const projectId = storage.get("projectId");
        const provider = storage.get("link", "identityProvider");

        const { data } = await oauth.post("/oauth", {
          refreshToken,
          appId,
          projectId,
          provider,
        });

        accessToken = data.accessToken;
        storage.set("link", "accessToken", accessToken);
        console.log(
          "Access token refreshed successfully, now fetching user details"
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

instance.getPermittedUsers = async () => {
  const userIds = [];
  const refreshToken = await storage.get("link", "refreshToken");
  const response = await http.get("/permissions");

  response.data.forEach((permission) => {
    userIds.push(permission.userId);
  });

  const users = await Promise.all(
    userIds.map(async (userId) => {
      const response = await axios.get(
        `https://api.github.com/user/${userId}`,
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );
      return response.data;
    })
  );

  return users;
};

export default instance;
