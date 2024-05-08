const menuConfig = {
  topMenu: [],
  sideMenu: [
    {
      subheader: "Service",
      items: [
        {
          title: "Service",
          icon: "solar:code-2-bold-duotone",
          path: "/service",
        },
        {
          title: "Reports",
          icon: "solar:chart-line-duotone",
          path: "/service/reports",
        },
        {
          title: "Logs",
          icon: "solar:course-up-bold-duotone",
          path: "/service/logs",
        },
      ],
    },
  ],
  endItem: {
    title: "Project Settings",
    icon: "ic:baseline-settings",
    path: "/settings",
  },
  options: [
    {
      label: "Home",
      linkTo: "/",
    },
    {
      label: "Profile",
      linkTo: "/",
    },
    {
      label: "Settings",
      linkTo: "/",
    },
  ],
  actionButtons: [],
};

export default menuConfig;
