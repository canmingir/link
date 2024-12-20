import ActionButton from "./src/widgets/ActionButton";

const menuConfig = {
  topMenu: [],
  sideMenu: [
    {
      subheader: "SPQR",
      items: [
        {
          title: "Emperor",
          icon: "game-icons:olive",
          path: "/emperor",
        },
        {
          title: "Battles",
          icon: "pepicons-print:swords",
          path: "/emperor/battle",
        },
      ],
    },
  ],
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
  actionButtons: [ActionButton],
};

export default menuConfig;
