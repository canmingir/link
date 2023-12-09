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

function getProjectName() {
  const { name } = globalConfig();

  if (name) {
    return name;
  }
}

instance.interceptors.request.use(async (request) => {
  const refreshToken = await storage.get(getProjectName(), "refreshToken");
  console.log("refreshToken", getProjectName());
  if (refreshToken) {
    request.headers["Authorization"] = `Bearer ${refreshToken}`;
  }
  return request;
});

export default instance;
