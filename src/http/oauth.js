import axios from "axios";
import axiosRetry from "axios-retry";
import qs from "qs";

const instance = axios.create({
  headers: {
    common: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  },
});

export const updateAxiosInstanceConfig = (config) => {
  instance.defaults.baseURL = config.api;
};

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
