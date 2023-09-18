import menuConfig from "./config.menu";
const config = {
  name: "GrayCollar",
  base: "/graycollar",
  api: "https://nuc.land/graycollar",
  login: {
    icon: "/graycollar/media/logo.png",
    name: "GrayCollar Dashboard",
    github: {
      authUrl: "https://github.com/login/oauth/authorize",
      clientId: "4806a6f27dc44ac5c27f",
      redirectUri: "https://nuc.land/graycollar/callback",
      scope: "user",
      response_type: "code",
    },
  },
  flowise: {
    token: "Bearer LoLQZcqQsDQgqVCEGbV4fH7CL9HLnzryWObnPYxch5o=",
    url: "http://flowise.graycollar.ai:3000/api/v1/prediction/88666388-0cae-4735-96e9-7c15b12896df",
  },
  ...menuConfig,
};

export default config;
