import axios from "axios";
import config from "../../config";

const instance = axios.create({
  baseURL: config.api,
  headers: { "X-Custom-Header": "foobar" },
});

export default instance;
