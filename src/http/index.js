import axios from "axios";
import config from "../config/config";
import oauth from "./oauth";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";

const instance = axios.create({
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

instance.interceptors.request.use((request) => {
  const { base } = config();
  const accessToken = storage.get("link", "accessToken");

  if (!accessToken) {
    window.location.href = base === "/" ? "/login" : `${base}/login`;
  }

  request.headers["Authorization"] = `Bearer ${accessToken}`;

  publish("LOADED", { loading: true });

  return request;
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
}

async function doRefresh() {
  const { appId } = config();
  const projectId = storage.get("projectId");
  const identityProvider = storage.get("link", "identityProvider");

  const { data } = await oauth.post("/oauth", {
    refreshToken: storage.get("link", "refreshToken"),
    appId,
    projectId,
    identityProvider,
    ...(identityProvider === "DEMO" && {
      username: "admin",
      password: "admin",
    }),
  });

  storage.set("link", "accessToken", data.accessToken);
  if (data.refreshToken) {
    storage.set("link", "refreshToken", data.refreshToken);
  }
  return data.accessToken;
}

instance.interceptors.response.use(
  (response) => {
    if (response.headers["content-type"] === "application/json") {
      response.data = JSON.parse(response.data);
    }
    publish("LOADED", { loading: false });
    return response;
  },
  async (error) => {
    publish("LOADED", { loading: false });
    const originalRequest = error.config;
    const statusCode = error.response?.status;

    if (statusCode === 401 && !originalRequest._retried) {
      originalRequest._retried = true;

      const usedToken = originalRequest.headers["Authorization"]?.replace(
        "Bearer ",
        ""
      );
      const storedToken = storage.get("link", "accessToken");

      if (storedToken && storedToken !== usedToken) {
        originalRequest.headers["Authorization"] = `Bearer ${storedToken}`;
        return instance(originalRequest);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return instance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const token = await doRefresh();
        processQueue(null, token);
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const { base } = config();
        storage.remove("link", "accessToken");
        storage.remove("link", "refreshToken");
        window.location.href = `${window.location.origin}${base}/login`;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    switch (statusCode) {
      case 400:
        publish("GLOBAL_MESSAGE_POSTED", {
          status: true,
          message: "BAD REQUEST",
          severity: "warning",
        });
        break;
      case 403:
        publish("GLOBAL_MESSAGE_POSTED", {
          status: true,
          message: "ERROR",
          severity: "warning",
        });
        break;
      case 404:
        publish("GLOBAL_MESSAGE_POSTED", {
          status: true,
          message: "NOT FOUND",
          severity: "warning",
        });
        break;
      case 500:
        publish("GLOBAL_MESSAGE_POSTED", {
          status: true,
          message: "INTERNAL SERVER ERROR",
          severity: "warning",
        });
        break;
      case 502:
        publish("GLOBAL_MESSAGE_POSTED", {
          status: true,
          message: "BAD GATEWAY",
          severity: "warning",
        });
        break;
    }
    return Promise.reject(error);
  }
);

export const fetcher = (url) => instance.get(url).then((res) => res.data);

export default instance;
