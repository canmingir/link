let _config = {};

function globalConfig(cfg) {
  if (cfg) {
    _config = cfg;
  }
  return _config;
}

export default globalConfig;
