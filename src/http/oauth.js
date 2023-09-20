import axios from "axios";
import axiosRetry from "axios-retry";
import globalConfig from "../config";
import qs from "qs";

const instance = axios.create({
  baseURL: "",
  headers: {
    common: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  },
});

axiosRetry(instance, { retries: 3 });

function updateBaseURL() {
  const config = globalConfig();

  if (config.api) {
    instance.defaults.baseURL = config.api;
  }
}

instance.interceptors.request.use((request) => {
  updateBaseURL();

  request.baseURL = instance.defaults.baseURL;
  console.log("Request", request);

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
