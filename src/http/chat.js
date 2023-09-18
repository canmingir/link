import axios from "axios";
import config from "../../config";
const instance = axios.create({
  headers: {
    Authorization: config.flowise.token,
    common: {
      "Content-Type": "application/json",
    },
  },
});

axios.interceptors.response.use((response) => {
  response.data = JSON.parse(response.data);

  return response;
});

export default instance;
