const TeamIcons = [
  {
    id: "team_icons",
    name: "Team Icons",
    emojis: [
      "site",
      "box",
      "3d",
      "cafe",
      "cargo",
      "cloud",
      "code",
      "company",
      "rtruck",
      "truck",
      "sign",
      "resume",
      "printer",
      "fingerprint",
      "distributed",
      "conversation",
      "forest",
      "headphones",
      "office",
      "path",
      "project",
      "rocket",
    ].map((icon) => ({
      id: icon,
      skins: [{ src: `./media/TeamIcons/${icon}.png` }],
    })),
  },
];

export default TeamIcons;
