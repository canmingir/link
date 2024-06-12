import axios from "axios";
import axiosRetry from "axios-retry";
import config from "../config/config.js";
import qs from "qs";

const instance = axios.create({
  baseURL: "",
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

axiosRetry(instance, { retries: 3 });

function updateBaseURL() {
  const { api } = config.get();

  if (api) {
    instance.defaults.baseURL = config.api;
  }
}

instance.interceptors.request.use((request) => {
  updateBaseURL();

  request.baseURL = instance.defaults.baseURL;

  return request;
});

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
