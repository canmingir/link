import axios from "axios";
import config from "../config/config.js";
import http from "./index";
import { storage } from "@nucleoidjs/webstorage";

const instance = axios.create({
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

function getProjectName() {
  const { name } = config();

  if (name) {
    return name;
  }
}

instance.interceptors.request.use(async (request) => {
  const refreshToken = await storage.get(getProjectName(), "refreshToken");
  if (refreshToken) {
    request.headers["Authorization"] = `Bearer ${refreshToken}`;
  }
  return request;
});

instance.getUserDetails = async () => {
  const refreshToken = await storage.get(getProjectName(), "refreshToken");
  const { google, github } = config().project;
  //TODO: do it in a more elegant way
  let userUrl;
  let provider;
  if (google) {
    userUrl = google.userUrl;
    provider = "google";
  } else if (github) {
    userUrl = github.userUrl;
    provider = "github";
  }

  if (refreshToken) {
    try {
      const response = await axios.get(userUrl, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      if (provider === "github") {
        return {
          name: response.data.login,
          avatarUrl: response.data.avatar_url,
        };
      } else if (provider === "google") {
        return {
          name: response.data.name,
          avatarUrl: response.data.picture,
        };
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      throw error;
    }
  }
  return null;
};

instance.getPermittedUsers = async () => {
  const userIds = [];
  const refreshToken = await storage.get(getProjectName(), "refreshToken");
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
