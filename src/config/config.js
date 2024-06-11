import { ConfigSchema } from "./ConfigSchema.js";
import { MenuConfigSchema } from "./MenuConfigSchema.js";
import { TemplateConfigSchema } from "./TemplateConfigSchema.js";

let _mainConfig = {};
let _menuConfig = {};
let _templateConfig = {};

const config = {
  init: async function () {
    const configMenu = await import("../../../../config.menu.js");
    const configTemplate = await import("../../../../config.template.js");
    const configMain = await import("../../../../config.js");

    const { value: mainConfig, error: errorConfig } =
      await ConfigSchema.validate(configMain.default);
    const { value: menuConfig, error: errorMenu } =
      await MenuConfigSchema.validate(configMenu.default);
    const { value: templateConfig, error: errorTemplate } =
      await TemplateConfigSchema.validate(configTemplate.default);

    if (errorConfig || errorMenu || errorTemplate) {
      throw errorConfig || errorMenu || errorTemplate;
    }

    _mainConfig = mainConfig;
    _menuConfig = menuConfig;
    _templateConfig = templateConfig;

    const config = {
      ..._mainConfig,
      menu: _menuConfig,
      template: _templateConfig,
    };

    return config;
  },
  vite: async function () {
    const mainConfig = await import("../../../../config.js");
    const { value, error } = ConfigSchema.validate(mainConfig.default);
    return { error, value };
  },
  get: function () {
  },
};

export default config;
