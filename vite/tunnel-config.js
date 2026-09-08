const VIRTUAL_ID = "\0link-tunnel-config";

function override(config, url) {
  const rebase = (value) => {
    try {
      const { pathname, search } = new URL(value);
      return `${url}${pathname}${search}`.replace(/\/$/, "");
    } catch {
      return value;
    }
  };

  const project = config.project
    ? Object.fromEntries(
        Object.entries(config.project).map(([name, provider]) => [
          name,
          provider?.redirectUri
            ? { ...provider, redirectUri: rebase(provider.redirectUri) }
            : provider,
        ])
      )
    : config.project;

  return {
    ...config,
    api: `${url}/api`,
    socket: config.socket ? { ...config.socket, host: url } : config.socket,
    project,
  };
}

function source(config, url) {
  return `export default ${JSON.stringify(override(config, url), null, 2)};\n`;
}

function tunnelConfig({ config, url, configPath }) {
  return {
    name: "link-tunnel-config",
    apply: "serve",
    enforce: "pre",

    async resolveId(id, importer, options) {
      const resolved = await this.resolve(id, importer, {
        ...options,
        skipSelf: true,
      });

      return resolved?.id === configPath ? VIRTUAL_ID : null;
    },

    load(id) {
      return id === VIRTUAL_ID ? source(config, url) : null;
    },
  };
}

function tunnelConfigEsbuild({ config, url, configPath }) {
  const filter = new RegExp(
    `^${configPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`
  );

  return {
    name: "link-tunnel-config",
    setup(build) {
      build.onLoad({ filter }, () => ({
        contents: source(config, url),
        loader: "js",
      }));
    },
  };
}

export default tunnelConfig;
export { tunnelConfigEsbuild };
