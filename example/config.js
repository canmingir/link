import { Button } from "@mui/material";
import ConsoleButton from "./src/widgets/ConsoleButton";
import menuConfig from "./config.menu";

const config = {
  base: "/AAA", //Optional
  api: "http://localhost:3001", //Optional but login doesn't work without it
  login: {
    //Mandatory
    icon: "/media/logo.png",
    largeIcon: "/media/largeLogo.png",
    name: "Gray Collar Dashboard",
    nucleoid: {},
    github: {
      authUrl: "https://github.com/login/oauth/authorize",
      clientId: "0c2844d3d19dc9293fc5",
      redirectUri: "http://localhost:5173/callback",
      scope: "user",
      response_type: "code",
    },
  },
  settings: {
    mode: "dark", // 'light' | 'dark'
  },
  ...menuConfig,
  itemsData: [
    {
      id: 1,
      title: "Project X",
      icon: "tdesign/anchor",
    },
    {
      id: 2,
      title: "Project Y",
      icon: "material-symbols/wine-bar",
    },
    {
      id: 3,
      title: "Deneme",
      icon: "material-symbols/wind-power-sharp",
    },
    {
      id: 4,
      title: "Fasign",
      icon: "material-symbols/whatshot",
    },
  ],
};

export default config;
