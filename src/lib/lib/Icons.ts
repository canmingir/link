const Icons = [
  {
    id: "project_icons",
    name: "Project Icons",
    emojis: [
      "solar/book-2-line-duotone",
      "solar/chat-square-2-line-duotone",
      "solar/chat-square-code-line-duotone",
      "solar/cpu-line-duotone",
    ].map((icon) => ({
      id: icon,
      skins: [
        {
          src: `https://api.iconify.design/${icon}.svg?color=%232065d1&width=75&height=75'`,
        },
      ],
    })),
  },
  {
    id: "service_icons",
    name: "Service Icons",
    emojis: [
      "solar/asteroid-line-duotone",
      "solar/atom-line-duotone",
      "solar/accessibility-line-duotone",
      "solar/backpack-line-duotone",
      "solar/battery-charge-line-duotone",
      "solar/black-hole-3-line-duotone",
    ].map((icon) => ({
      id: icon,
      skins: [
        {
          src: `https://api.iconify.design/${icon}.svg?color=%232065d1&width=75&height=75'`,
        },
      ],
    })),
  },
];

export default Icons;
