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
  try {
    const refreshToken = await storage.get(getProjectName(), "refreshToken");
    if (!refreshToken) {
      console.log("No refresh token found");
      return null;
    }

    const response = await http.get("/oauth/user", {
      headers: {
        'X-Refresh-Token': refreshToken
      }
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