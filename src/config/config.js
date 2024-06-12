import { ConfigSchema } from "./ConfigSchema.js";
import { MenuConfigSchema } from "./MenuConfigSchema.js";
import { TemplateConfigSchema } from "./TemplateConfigSchema.js";
import configMain from "../../../../config.js";
import configMenu from "../../../../config.menu.js";
import configTemplate from "../../../../config.template.js";
import { publish } from "@nucleoidai/react-event";

let _mainConfig = {};
let _menuConfig = {};
let _templateConfig = {};

const config = {
  init: function () {
    const { value: mainConfig, error: errorConfig } =
      ConfigSchema.validate(configMain);
    const { value: menuConfig, error: errorMenu } =
      MenuConfigSchema.validate(configMenu);
    const { value: templateConfig, error: errorTemplate } =
      TemplateConfigSchema.validate(configTemplate);

    if (errorConfig || errorMenu || errorTemplate) {
      publish("CONFIG_INITIALIZE_FAILED", {
        error: errorConfig.stack || errorMenu.stack || errorTemplate.stack,
      });
      throw errorConfig || errorMenu || errorTemplate;
    }

    _mainConfig = mainConfig;
    _menuConfig = menuConfig;
    _templateConfig = templateConfig;

    publish("CONFIG_INITIALIZED", mainConfig);
  },
  get: function () {
    const config = {
      ..._mainConfig,
      menu: _menuConfig,
      template: _templateConfig,
    };

    return config;
  },
};

export default config;
