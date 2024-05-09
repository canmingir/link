const config = {
  name: "Nucleoid.com",
  base: "/",
  env: "dev",
  api: "http://localhost:3000",
  login: {
    icon: "/media/logo.png",
    largeIcon: "/media/largeLogo.png",
    name: "Nucleoid.com",
    nucleoid: {},
    github: {
      authUrl: "https://github.com/login/oauth/authorize",
      clientId: "0c2844d3d19dc9293fc5",
      redirectUri: "http://localhost:5173/callback",
      userUrl: "https://api.github.com/user",
      scope: "user",
      response_type: "code",
    },
  },
  settings: {
    mode: "dark", // 'light' | 'dark'
    colorPresets: "cyan", // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
  },
  itemsPath: "/emperors",
};

export default config;
