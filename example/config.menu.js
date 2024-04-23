import ActionButton from "./src/components/ActionButton";
const menuConfig = {
  sideMenu: [
    {
      subheader: "Pages",
      items: [
        {
          title: "First Page",
          icon: "solar:fire-minimalistic-bold-duotone",
          path: "/",
        },
        {
          title: "Main",
          icon: "solar:home-2-bold-duotone",
          path: "/main",
        },
        {
          title: "Second Page",
          icon: "solar:document-bold-duotone",
          path: "/secondPage",
        },
      ],
    },
    {
      subheader: "SUBLISTS",
      items: [
        {
          title: "user",
          path: "/user",
          icon: "solar:users-group-rounded-bold-duotone",
          children: [
            {
              title: "profile",
              path: "/user/profile",
              icon: "solar:shield-user-bold-duotone",
            },
            {
              title: "list",
              path: "/user/list",
              icon: "solar:list-bold-duotone",
            },
            {
              title: "create",
              path: "/user/create",
              icon: "solar:add-circle-bold-duotone",
            },
            {
              title: "delete",
              path: "/user/delete",
              icon: "solar:trash-bin-2-bold-duotone",
            },
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
      addNewItem: function addNew() {},
      itemsData: [{ id: 1, title: "item1", icon: ":box:" }],
    },
  ],

  actionButtons: [ActionButton],
  fullScreenLayout: "left",
};

export default menuConfig;
