import axios from "axios";
import axiosRetry from "axios-retry";
import config from "../config/config.js";
import qs from "qs";
import { subscribe } from "@nucleoidai/react-event";

const instance = axios.create({
  baseURL: "",
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

subscribe("CONFIG_INITIALIZED", () => {
  instance.defaults.baseURL = config.get().api;
});

axiosRetry(instance, { retries: 3 });

instance.interceptors.response.use(
  (response) => {
    response.data = qs.parse(response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
