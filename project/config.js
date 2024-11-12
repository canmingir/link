const config = {
  appId: "f8f40046-4907-4f26-9316-6bdd0ea73b85",
  name: "SPQR",
  base: "/",
  api: "http://localhost:3000",
  oauth: {
    github: {
      authUrl: "https://github.com/login/oauth/authorize",
      clientId: "0c2844d3d19dc9293fc5",
      redirectUri: "http://localhost:5173/callback",
      userUrl: "https://api.github.com/user",
      scope: "user",
      response_type: "code",
    },
  },
};

export default config;
