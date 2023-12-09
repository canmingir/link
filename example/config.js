import menuConfig from "./config.menu";

const config = {
  base: "",
  login: {
    icon: "/media/logo.png",
    largeIcon: "/media/largeLogo.png",
    name: "Gray Collar Dashboard",
    github: {
      authUrl: "https://github.com/login/oauth/authorize",
      clientId: "0c2844d3d19dc9293fc5",
      redirectUri: "http://localhost:5173/callback",
      scope: "user",
      response_type: "code",
    },
  },
  flowise: {
    token: "Bearer LoLQZcqQsDQgqVCEGbV4fH7CL9HLnzryWObnPYxch5o=",
    url: "http://flowise.graycollar.ai:3000/api/v1/prediction/88666388-0cae-4735-96e9-7c15b12896df",
  },
  settings: {
    mode: "dark", // 'light' | 'dark'
    colorPresets: "cyan", // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
  },
  ...menuConfig,
};

export default config;
