
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
      name: "Main",
      url: "/main",
      hide: true,
      hideTopBar: false,
    },
  ],
  sideMenu: [
    {
      name: "Index",
      url: "/",
      hideTopBar: false,
    },
    {
      name: "Main",
      url: "/main",
      hideTopBar: false,
    },
    {
      name: "Second Page",
      url: "/main/secondPage",
      hideTopBar: false,
    },
  ],
  topMenuColor: "custom.sidebarBG",
};

export default menuConfig;
