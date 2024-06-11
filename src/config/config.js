import { ConfigSchema } from "./ConfigSchema.js";
import mainConfig from "../../../../config.js";
let _config = {};

const config = {
  init: function () {
    const { value, error } = ConfigSchema.validate(mainConfig);
    if (error) {
      throw error;
    }
    _config = value;
  },
  vite: function () {
    const { value, error } = ConfigSchema.validate(mainConfig);
    return { error, value };
  },
  get: function () {
    return _config;
  },
};

export default config;
