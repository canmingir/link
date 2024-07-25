import axios from "axios";
import axiosRetry from "axios-retry";
import config from "../config/config.js";
import qs from "qs";

const instance = axios.create({
  baseURL: config().api,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
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
