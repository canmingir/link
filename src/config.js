let _config = {};

console.log("config.js");
function globalConfig(cfg) {
  if (cfg) {
    _config = cfg;
  }
  return _config;
}

export default globalConfig;
