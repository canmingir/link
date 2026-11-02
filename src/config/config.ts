import { publish } from "@nucleoidai/react-event";
import configMenu from "../../../../../../config.menu.ts";
import configTemplate from "../../../../../../config.template.ts";
import configMain from "../../../../../../config.ts";

import {
  ConfigSchema,
  MenuConfigSchema,
  TemplateConfigSchema,
} from "./schemas";
import type {
  LinkConfig,
  MainConfig,
  MenuConfig,
  TemplateConfig,
} from "./types";

let _mainConfig = {} as MainConfig;
let _menuConfig = {} as MenuConfig;
let _templateConfig = {} as TemplateConfig;

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
      file: errorMenu ? "config.menu.ts" : "config.template.ts",
    });
  }

  _mainConfig = mainConfig as MainConfig;
  _menuConfig = menuConfig as MenuConfig;
  _templateConfig = templateConfig as TemplateConfig;

  publish("CONFIG_INITIALIZED", mainConfig);
}

function config(): LinkConfig {
  return {
    ..._mainConfig,
    menu: _menuConfig,
    template: _templateConfig,
  };
}

export default config;
export { init };
