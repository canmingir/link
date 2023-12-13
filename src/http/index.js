import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import globalConfig from "../config";
import oauth from "./oauth";
import { publish } from "@nucleoidjs/synapses";
import { storage } from "@nucleoidjs/webstorage";

const config = globalConfig();

function updateConfig() {
  const config = globalConfig();
  instance.defaults.baseURL = config.api;
}

const instance = axios.create({
  baseURL: config.api,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

instance.interceptors.request.use((request) => {
  globalConfig();
  publish("LOADED", { loading: true });
  const accessToken = storage.get(config.name, "accessToken");
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
    updateConfig();
    const { data } = await oauth.post("/oauth", {
      refresh_token: storage.get(config.name, "refreshToken"),
    });
    const accessToken = data.access_token;
    failedRequest.response.config.headers["Authorization"] =
      "Bearer " + accessToken;
    storage.set(config.name, "accessToken", accessToken);
    return Promise.resolve();
  } catch (error) {
    storage.remove("accessToken");
    storage.remove("refreshToken");
    window.location.href = `${config.base}/login`;
    return false;
  }
};

createAuthRefreshInterceptor(instance, refreshAuthLogic);

export default instance;
