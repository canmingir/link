/* eslint-disable no-unused-vars */
const templateConfig = {
  theme: {
    variants: (theme) => ({
      MuiCard: {
        variants: [
          {
            props: { variant: "profile-card" },
            style: {
              mb: 3,
              height: 290,
            },
          },
        ],
      },
    }),
    mode: "dark",
    colorPresets: "cyan",
  },
  login: {
    variant: "modern",
    image: "https://minimals.cc/assets/background/overlay_3.jpg",
    icon: "https://cdn.nucleoid.com/media/icon.png",
    largeIcon: "https://cdn.nucleoid.com/media/icon.png",
  },
  projectBar: {
    label: "Emperor",
  },
};

export default templateConfig;
