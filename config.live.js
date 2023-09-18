import menuConfig from "./config.menu";
const config = {
  name: "GrayCollar",
  base: "/dashboard",
  api: "https://nucleoid.com",
  login: {
    icon: "./media/logo.png",
    name: "Gray Collar Dashboard",
    google: {
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      clientId: "GoogleClientId",
      redirectUri: "http://localhost:5173/console/callback",
      scope: "openid",
    },
  },
  flowise: {
    token: "Bearer LoLQZcqQsDQgqVCEGbV4fH7CL9HLnzryWObnPYxch5o=",
    url: "http://flowise.graycollar.ai:3000/api/v1/prediction/88666388-0cae-4735-96e9-7c15b12896df",
  },
  ...menuConfig,
};

export default config;
