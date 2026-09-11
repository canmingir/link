import Iconify from "../components/Iconify";
import React from "react";

export default {
  title: "Components/Iconify",
  component: Iconify,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: "text",
      description: "The icon name from Iconify",
    },
    width: {
      control: { type: "number", min: 8, max: 100, step: 2 },
      description: "Width and height of the icon in pixels",
    },
    sx: {
      control: "object",
      description: "MUI sx prop for styling",
    },
  },
  args: { onClick: () => {} },
};

export const Default = {
  args: {
    icon: "material-symbols:home",
    width: 24,
  },
};

export const Small = {
  args: {
    icon: "material-symbols:star",
    width: 16,
  },
};

export const Large = {
  args: {
    icon: "material-symbols:favorite",
    width: 48,
  },
};

export const WithCustomStyles = {
  args: {
    icon: "material-symbols:settings",
    width: 32,
    sx: {
      color: "primary.main",
      "&:hover": {
        color: "primary.dark",
        transform: "rotate(90deg)",
        transition: "all 0.3s ease",
      },
    },
  },
};

export const ColoredIcons = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Iconify
        icon="material-symbols:circle"
        width={24}
        sx={{ color: "red" }}
      />
      <Iconify
        icon="material-symbols:circle"
        width={24}
        sx={{ color: "green" }}
      />
      <Iconify
        icon="material-symbols:circle"
        width={24}
        sx={{ color: "blue" }}
      />
      <Iconify
        icon="material-symbols:circle"
        width={24}
        sx={{ color: "orange" }}
      />
    </div>
  ),
};

export const DifferentSizes = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Iconify icon="material-symbols:star" width={12} />
      <Iconify icon="material-symbols:star" width={16} />
      <Iconify icon="material-symbols:star" width={20} />
      <Iconify icon="material-symbols:star" width={24} />
      <Iconify icon="material-symbols:star" width={32} />
      <Iconify icon="material-symbols:star" width={40} />
    </div>
  ),
};

export const PopularIcons = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "16px",
        alignItems: "center",
        justifyItems: "center",
        padding: "16px",
      }}
    >
      <Iconify icon="material-symbols:home" width={24} />
      <Iconify icon="material-symbols:search" width={24} />
      <Iconify icon="material-symbols:favorite" width={24} />
      <Iconify icon="material-symbols:settings" width={24} />
      <Iconify icon="material-symbols:person" width={24} />
      <Iconify icon="material-symbols:notifications" width={24} />
      <Iconify icon="material-symbols:mail" width={24} />
      <Iconify icon="material-symbols:phone" width={24} />
      <Iconify icon="material-symbols:location-on" width={24} />
      <Iconify icon="material-symbols:calendar-today" width={24} />
      <Iconify icon="material-symbols:shopping-cart" width={24} />
      <Iconify icon="material-symbols:menu" width={24} />
    </div>
  ),
};

export const WithAnimation = {
  args: {
    icon: "material-symbols:refresh",
    width: 32,
    sx: {
      color: "primary.main",
      animation: "spin 2s linear infinite",
      "@keyframes spin": {
        "0%": {
          transform: "rotate(0deg)",
        },
        "100%": {
          transform: "rotate(360deg)",
        },
      },
    },
  },
};

export const InteractiveIcon = {
  args: {
    icon: "material-symbols:thumb-up",
    width: 28,
    sx: {
      color: "text.secondary",
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        color: "primary.main",
        transform: "scale(1.1)",
      },
      "&:active": {
        transform: "scale(0.95)",
      },
    },
  },
};

export const IconWithBackground = {
  args: {
    icon: "material-symbols:check",
    width: 24,
    sx: {
      color: "white",
      backgroundColor: "success.main",
      borderRadius: "50%",
      padding: "8px",
      width: 40,
      height: 40,
    },
  },
};
