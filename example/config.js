import menuConfig from "./config.menu";

const config = {
  name: "GrayCollar",
  base: "",
  api: "http://localhost:5001",
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
  ...menuConfig,
  itemsData: [
    {
      id: 1,
      name: "Project X",
      icon: "team",
    },
    {
      id: 2,
      name: "Project top",
      icon: "team",
    },
    {
      id: 3,
      name: "Team 3",
      icon: "team",
    },
    {
      id: 4,
      name: "Team red",
      icon: "team",
    },
  ],
};

export default config;
