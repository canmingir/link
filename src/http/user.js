import axios from "axios";
import config from "../../../../config.js";
import { storage } from "@nucleoidjs/webstorage";

const instance = axios.create({
  baseURL: config.api,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

function getProjectName() {
  const { name } = config;

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

  if (refreshToken) {
    try {
      const response = await axios.get(
        config.login?.github.userUrl || config.login?.google.userUrl,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      if (config.login.github.userUrl) {
        return {
          name: response.data.login,
          avatarUrl: response.data.avatar_url,
        };
      } else if (config.login.google.userUrl) {
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

export default instance;
