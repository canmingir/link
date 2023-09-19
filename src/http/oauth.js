import axios from "axios";
import axiosRetry from "axios-retry";
import qs from "qs";
import { useConfig } from "../context/ConfigContext";

//const config = useConfig();
const instance = axios.create({
  baseURL: "config.api",
  headers: {
    common: {
      "Content-Type": "application/x-www-form-urlencoded",
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
