import axios from "axios";
import globalConfig from "../config";
import { storage } from "@nucleoidjs/webstorage";

const config = globalConfig();

const instance = axios.create({
  baseURL: config.api,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

instance.interceptors.request.use(async (request) => {
  const refreshToken = await storage.get("dashboard", "refreshToken");
  if (refreshToken) {
    request.headers["Authorization"] = `Bearer ${refreshToken}`;
  }
  return request;
});

export default instance;
