let config;
let menuConfig;
let routes;

async function LoadConfig() {
  if (!config) {
    config = (await import("../../../config.js")).default;
  }
  return config;
}

async function LoadMenuConfig() {
  if (!menuConfig) {
    menuConfig = (await import("../../../config.menu.js")).default;
  }
  return menuConfig;
}

async function LoadRoutes() {
  if (!routes) {
    routes = (await import("../../../routes.js")).default;
  }
  return routes;
}

export { LoadConfig, LoadMenuConfig, LoadRoutes };
