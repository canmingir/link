import { Box, Button } from "@mui/material";

const menuConfig = {
  sideMenu: [
    {
      subheader: "Anasayfa",
      items: [
        {
          title: "Index",
          icon: "solar:home-2-bold-duotone",
          path: "/",
        },
        {
          title: "Main",
          icon: "solar:home-2-bold-duotone",
          path: "/main",
        },
        {
          title: "SecondPage",
          icon: "solar:atom-bold-duotone",
          path: "/secondPage",
        },
      ],
    },

    {
      subheader: "management",
      items: [
        {
          title: "user",
          path: "https://solarjs.vercel.app/components",
          icon: "solar:home-2-bold-duotone",
          children: [
            { title: "four", path: "https://solarjs.vercel.app/components" },
            { title: "five", path: "https://solarjs.vercel.app/componentse" },
            { title: "six", path: "https://solarjs.vercel.app/components" },
          ],
        },
      ],
    },
  ],

  topMenu: [
    {
      title: "Index",
      icon: "solar:home-2-bold-duotone",
      path: "/",
    },
    {
      title: "Main",
      icon: "solar:home-2-bold-duotone",
      path: "/main",
    },
    {
      title: "SecondPage",
      icon: "solar:atom-bold-duotone",
      path: "/secondPage",
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

  itemBar: [
    {
      itemName: "item",
      addNewItem: function addNew() {
        return console.log("addNewItem");
      },
      itemsData: [{ id: 1, title: "item1", icon: ":box:" }],
    },
  ],

  actionButtons: [Button],
  fullScreenLayout: "top",
};

export default menuConfig;
