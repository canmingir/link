import axios from "axios";
import config from "../config/config";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { jwtDecode } from "jwt-decode";
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
    const statusCode = error.response?.status;

    if (statusCode === 500) {
      const token = storage.get("link", "accessToken");
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          return Promise.reject(error);
        }
      } catch (_) {
        return Promise.reject(error);
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
  },
);

export const fetcher = (url) => instance.get(url).then((res) => res.data);

const refreshAuthLogic = async (failedRequest) => {
  try {
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

    const { accessToken, refreshToken } = data;

    failedRequest.response.config.headers["Authorization"] =
      "Bearer " + accessToken;

    storage.set("link", "accessToken", accessToken);
    if (refreshToken) {
      storage.set("link", "refreshToken", refreshToken);
    }

    return Promise.resolve();
  } catch (error) {
    const { base } = config();

    storage.remove("link", "accessToken");
    storage.remove("link", "refreshToken");

    window.location.href = `${window.location.origin}${base}/login`;
    return Promise.reject(error);
  }
};

const refreshInterceptor =
  typeof createAuthRefreshInterceptor === "function"
    ? createAuthRefreshInterceptor
    : createAuthRefreshInterceptor.default;

refreshInterceptor(instance, refreshAuthLogic, {
  statusCodes: [401, 403, 500],
  pauseInstanceWhileRefreshing: true,
  shouldRefresh: (error) => {
    const { base } = config();
    const token = storage.get("link", "accessToken");
    const identityProvider = storage.get("link", "identityProvider");
    const statusCode = error.response?.status;

    if (!token) {
      window.location.href = `${window.location.origin}${base}/login`;
      return false;
    }

    if (identityProvider === "DEMO") {
      if (statusCode !== 500) {
        return true;
      }

      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.exp * 1000 < Date.now();
      } catch (_) {
        // If we can't decode, attempt refresh once.
        return true;
      }
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        return true;
      }
    } catch (err) {
      window.location.href = `${window.location.origin}${base}/login`;
      return false;
    }

    return false;
  },
});

export default instance;
