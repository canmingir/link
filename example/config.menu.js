const menuConfig = {
  topMenu: [
    { name: "/", url: `/`, hide: true },
    {
      name: "Teams",
      url: "/teams",
      hide: true,
    },
    {
      name: "Chat",
      url: "/teams/chat",
      hide: true,
    },
    {
      name: "Colleagues",
      url: "/teams/colleagues",
      hide: true,
    },
    {
      name: "Colleagues",
      url: "/colleagues/:colleagueId",
      hide: true,
    },
  ],
  sideMenu: [
    {
      name: "Colleagues",
      url: "/teams/colleagues",
      icon: ListIcon,
    },
    {
      name: "Chat",
      url: "/teams/chat",
      icon: ChatIcon,
    },
  ],
};

export default menuConfig;
