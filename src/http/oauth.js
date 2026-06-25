import axios from "axios";
import axiosRetry from "axios-retry";
import config from "../config/config.js";

const instance = axios.create({
  baseURL: config().api,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

axiosRetry(instance, { retries: 2 });

export default instance;
