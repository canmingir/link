import ChatIcon from "@mui/icons-material/Chat";
import ListIcon from "@mui/icons-material/List";

const menuConfig = {
  topMenu: [
    { name: "/", url: `/`, hide: true, hideTopBar: false },
    {
      name: "Main",
      url: "/main",
      hide: true,
      hideTopBar: true,
    },
    {
      name: "Chat",
      url: "/teams/chat",
      hide: true,
      hideTopBar: false,
    },
    {
      name: "Colleagues",
      url: "/teams/colleagues",
      hide: true,
      hideTopBar: false,
    },
    {
      name: "Colleagues",
      url: "/colleagues/:colleagueId",
      hide: true,
      hideTopBar: false,
    },
  ],
  sideMenu: [
    {
      name: "Colleagues",
      url: "/teams/colleagues",
      icon: ListIcon,
      hideTopBar: false,
    },
    {
      name: "Chat",
      url: "/teams/chat",
      icon: ChatIcon,
      hideTopBar: true,
    },
  ],
  topMenuColor: "custom.sidebarBG",
};

export default menuConfig;
