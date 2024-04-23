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

export default instance;
