const STORAGE_KEYS = {
  accessToken: "link.accessToken",
  refreshToken: "link.refreshToken",
  identityProvider: "link.identityProvider",
  projectId: "projectId",
};

function autoLogin({
  appId,
  projectId,
  identityProvider = "DEMO",
  requestUrl = "/api/oauth",
  storage = {},
} = {}) {
  return {
    name: "link-tunnel-autologin",
    apply: "serve",
    transformIndexHtml(html) {
      if (!appId || !projectId) {
        console.warn(
          "[tunnel] auto-login skipped: could not resolve appId or projectId."
        );
        return html;
      }

      const script = `
(async () => {
  var K = ${JSON.stringify(STORAGE_KEYS)};
  var extra = ${JSON.stringify(storage)};
  try {
    if (localStorage.getItem(K.accessToken)) return;
    var res = await fetch(${JSON.stringify(requestUrl)}, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: ${JSON.stringify(appId)},
        projectId: ${JSON.stringify(projectId)},
        username: "admin",
        password: "admin",
        identityProvider: ${JSON.stringify(identityProvider)},
      }),
    });
    if (!res.ok) {
      console.warn("[tunnel] auto-login failed:", res.status, await res.text());
      return;
    }
    var d = await res.json();
    localStorage.setItem(K.accessToken, d.accessToken);
    localStorage.setItem(K.refreshToken, d.refreshToken);
    localStorage.setItem(K.identityProvider, ${JSON.stringify(identityProvider)});
    localStorage.setItem(K.projectId, ${JSON.stringify(projectId)});
    for (var key in extra) localStorage.setItem(key, extra[key]);
    location.reload();
  } catch (e) {
    console.warn("[tunnel] auto-login error:", e);
  }
})();
`.trim();

      return {
        html,
        tags: [{ tag: "script", children: script, injectTo: "head-prepend" }],
      };
    },
  };
}

export default autoLogin;
export { STORAGE_KEYS };
