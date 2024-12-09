import {
  ConfigSchema,
  LoginConfigSchema,
  MenuConfigSchema,
  TemplateConfigSchema,
} from "./schemas.js";

import configMain from "../../../../../config.js";
import configMenu from "../../../../../config.menu.js";
import configTemplate from "../../../../../config.template.js";
import { publish } from "@nucleoidai/react-event";

let _mainConfig = {};
let _menuConfig = {};
let _templateConfig = {};
let _loginConfig = {};

function init() {
  const { value: mainConfig, error: errorConfig } =
    ConfigSchema.validate(configMain);
  const { value: menuConfig, error: errorMenu } =
    MenuConfigSchema.validate(configMenu);
  const { value: templateConfig, error: errorTemplate } =
    TemplateConfigSchema.validate(configTemplate);

  if (errorConfig || errorMenu || errorTemplate) {
    publish("CONFIG_INITIALIZE_FAILED", {
      error: errorConfig?.stack || errorMenu?.stack || errorTemplate?.stack,
      file: errorMenu ? "config.menu.js" : "config.template.js",
    });
    return;
  }

  _mainConfig = mainConfig;
  _menuConfig = menuConfig;
  _templateConfig = templateConfig;

  Promise.resolve().then(() => {
    try {
      const loginModule = require("../../../../../config.login.js");
      if (loginModule.default) {
        const { value: loginConfig, error: errorLogin } =
          LoginConfigSchema.validate(loginModule.default);
        if (!errorLogin) {
          _loginConfig = loginConfig;
        }
      }
    } catch (e) {
      console.log("Login config not found, continuing without authentication");
    }
    publish("CONFIG_INITIALIZED", mainConfig);
  });
}

function config() {
  return {
    ..._mainConfig,
    menu: _menuConfig,
    template: _templateConfig,
    login: _loginConfig,
  };
}

export default config;
export { init };
