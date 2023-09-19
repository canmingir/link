import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import oauth from "./oauth";
import { publish } from "@nucleoidjs/synapses";
import { storage } from "@nucleoidjs/webstorage";

let globalConfig = {};

const instance = axios.create({
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

export const updateAxiosInstanceConfig = (config) => {
  instance.defaults.baseURL = config.api;
  globalConfig = config;
};

instance.interceptors.request.use((request) => {
  publish("LOADED", { loading: true });
  const accessToken = storage.get("dashboard", "accessToken");
  request.headers["Authorization"] = `Bearer ${accessToken}`;
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
    const statusCode = error.response.status;
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
      case 401:
        !refreshAuthLogic &&
          publish("GLOBAL_MESSAGE_POSTED", {
            status: true,
            message: "UNAUTHORIZED",
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
          message: "BAD GATEAWAY",
          severity: "warning",
        });
        break;
    }
    return Promise.reject(error);
  }
);

const refreshAuthLogic = async (failedRequest) => {
  try {
    const { data } = await oauth.post("/oauth", {
      refresh_token: storage.get("dashboard", "refreshToken"),
    });
    const accessToken = data.access_token;
    failedRequest.response.config.headers["Authorization"] =
      "Bearer " + accessToken;
    storage.set("dashboard", "accessToken", accessToken);
    return Promise.resolve();
  } catch (error) {
    storage.remove("accessToken");
    storage.remove("refreshToken");
    window.location.href = `${globalConfig.base}/login`;
    return false;
  }
};

createAuthRefreshInterceptor(instance, refreshAuthLogic);

export default instance;
