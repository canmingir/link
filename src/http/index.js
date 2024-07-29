import axios from "axios";
import config from "../config/config";
import oauth from "./oauth";
import { storage } from "@nucleoidjs/webstorage";

import { publish } from "@nucleoidai/react-event";

const instance = axios.create({
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

instance.interceptors.request.use((request) => {
  const { name } = config();
  const accessToken = storage.get(name, "accessToken");

  if (!accessToken) {
    window.location.href = "/login";
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

export const fetcher = (url) => instance.get(url).then((res) => res.data);

const refreshAuthLogic = async (failedRequest) => {
  try {
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

export default instance;
