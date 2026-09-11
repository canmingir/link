import Iconify from "../components/Iconify";
import Label from "../components/label";
import React from "react";

export default {
  title: "Components/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "The content of the label",
    },
    color: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
      ],
      description: "The color of the label",
    },
    variant: {
      control: "select",
      options: ["soft", "filled", "outlined"],
      description: "The variant of the label",
    },
    startIcon: {
      control: false,
      description: "Icon to display at the start of the label",
    },
    endIcon: {
      control: false,
      description: "Icon to display at the end of the label",
    },
    sx: {
      control: "object",
      description: "MUI sx prop for custom styling",
    },
  },
  args: { onClick: () => {} },
};

export const Default = {
  args: {
    children: "Default",
    color: "default",
    variant: "soft",
  },
};

export const Filled = {
  args: {
    children: "Filled",
    color: "primary",
    variant: "filled",
  },
};

export const Outlined = {
  args: {
    children: "Outlined",
    color: "primary",
    variant: "outlined",
  },
};

export const Soft = {
  args: {
    children: "Soft",
    color: "primary",
    variant: "soft",
  },
};

export const AllColors = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <Label color="default">Default</Label>
      <Label color="primary">Primary</Label>
      <Label color="secondary">Secondary</Label>
      <Label color="info">Info</Label>
      <Label color="success">Success</Label>
      <Label color="warning">Warning</Label>
      <Label color="error">Error</Label>
    </div>
  ),
};

export const AllVariants = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <strong style={{ minWidth: "80px" }}>Soft:</strong>
        <Label color="primary" variant="soft">
          Primary
        </Label>
        <Label color="success" variant="soft">
          Success
        </Label>
        <Label color="warning" variant="soft">
          Warning
        </Label>
        <Label color="error" variant="soft">
          Error
        </Label>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <strong style={{ minWidth: "80px" }}>Filled:</strong>
        <Label color="primary" variant="filled">
          Primary
        </Label>
        <Label color="success" variant="filled">
          Success
        </Label>
        <Label color="warning" variant="filled">
          Warning
        </Label>
        <Label color="error" variant="filled">
          Error
        </Label>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <strong style={{ minWidth: "80px" }}>Outlined:</strong>
        <Label color="primary" variant="outlined">
          Primary
        </Label>
        <Label color="success" variant="outlined">
          Success
        </Label>
        <Label color="warning" variant="outlined">
          Warning
        </Label>
        <Label color="error" variant="outlined">
          Error
        </Label>
      </div>
    </div>
  ),
};

export const WithStartIcon = {
  args: {
    children: "With Icon",
    color: "primary",
    variant: "soft",
    startIcon: <Iconify icon="material-symbols:star" width={16} />,
  },
};

export const WithEndIcon = {
  args: {
    children: "With Icon",
    color: "success",
    variant: "filled",
    endIcon: <Iconify icon="material-symbols:check" width={16} />,
  },
};

export const WithBothIcons = {
  args: {
    children: "Both Icons",
    color: "info",
    variant: "outlined",
    startIcon: <Iconify icon="material-symbols:info" width={16} />,
    endIcon: <Iconify icon="material-symbols:arrow-forward" width={16} />,
  },
};

export const StatusLabels = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <Label
        color="success"
        variant="soft"
        startIcon={<Iconify icon="material-symbols:check-circle" width={16} />}
      >
        Active
      </Label>
      <Label
        color="warning"
        variant="soft"
        startIcon={<Iconify icon="material-symbols:schedule" width={16} />}
      >
        Pending
      </Label>
      <Label
        color="error"
        variant="soft"
        startIcon={<Iconify icon="material-symbols:cancel" width={16} />}
      >
        Inactive
      </Label>
      <Label
        color="info"
        variant="soft"
        startIcon={<Iconify icon="material-symbols:info" width={16} />}
      >
        Draft
      </Label>
    </div>
  ),
};

export const PriorityLabels = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <Label
        color="error"
        variant="filled"
        startIcon={<Iconify icon="material-symbols:priority-high" width={16} />}
      >
        High
      </Label>
      <Label
        color="warning"
        variant="filled"
        startIcon={<Iconify icon="material-symbols:remove" width={16} />}
      >
        Medium
      </Label>
      <Label
        color="success"
        variant="filled"
        startIcon={
          <Iconify icon="material-symbols:keyboard-arrow-down" width={16} />
        }
      >
        Low
      </Label>
    </div>
  ),
};

export const DifferentContent = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Label color="primary">Text</Label>
      <Label color="secondary">123</Label>
      <Label color="info">v2.1.0</Label>
      <Label color="success">NEW</Label>
      <Label color="warning">BETA</Label>
      <Label color="error">DEPRECATED</Label>
    </div>
  ),
};

export const WithCustomStyling = {
  args: {
    children: "Custom Style",
    color: "secondary",
    variant: "soft",
    sx: {
      fontSize: 14,
      fontWeight: 600,
      borderRadius: 2,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      minWidth: 100,
    },
  },
};

export const InteractiveLabels = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <Label
        color="primary"
        variant="soft"
        sx={{
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          },
        }}
      >
        Clickable
      </Label>
      <Label
        color="success"
        variant="outlined"
        sx={{
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "success.main",
            color: "success.contrastText",
          },
        }}
      >
        Hover Me
      </Label>
    </div>
  ),
};

export const DifferentSizes = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Label
        color="primary"
        variant="soft"
        sx={{
          height: 20,
          fontSize: 10,
          px: 0.5,
          minWidth: 20,
        }}
      >
        XS
      </Label>
      <Label
        color="primary"
        variant="soft"
        sx={{
          height: 22,
          fontSize: 11,
          px: 0.6,
          minWidth: 22,
        }}
      >
        SM
      </Label>
      <Label color="primary" variant="soft">
        MD (Default)
      </Label>
      <Label
        color="primary"
        variant="soft"
        sx={{
          height: 28,
          fontSize: 13,
          px: 1,
          minWidth: 28,
        }}
      >
        LG
      </Label>
      <Label
        color="primary"
        variant="soft"
        sx={{
          height: 32,
          fontSize: 14,
          px: 1.2,
          minWidth: 32,
        }}
      >
        XL
      </Label>
    </div>
  ),
};

export const CategoryLabels = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <Label
        color="primary"
        variant="soft"
        startIcon={<Iconify icon="material-symbols:code" width={16} />}
      >
        Development
      </Label>
      <Label
        color="secondary"
        variant="soft"
        startIcon={
          <Iconify icon="material-symbols:design-services" width={16} />
        }
      >
        Design
      </Label>
      <Label
        color="info"
        variant="soft"
        startIcon={<Iconify icon="material-symbols:campaign" width={16} />}
      >
        Marketing
      </Label>
      <Label
        color="success"
        variant="soft"
        startIcon={
          <Iconify icon="material-symbols:account-balance" width={16} />
        }
      >
        Finance
      </Label>
      <Label
        color="warning"
        variant="soft"
        startIcon={<Iconify icon="material-symbols:support-agent" width={16} />}
      >
        Support
      </Label>
    </div>
  ),
};

export const BadgeUsage = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>Notifications</span>
        <Label color="error" variant="filled" sx={{ borderRadius: "50%" }}>
          3
        </Label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>Messages</span>
        <Label color="primary" variant="filled" sx={{ borderRadius: "50%" }}>
          12
        </Label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>Tasks</span>
        <Label color="warning" variant="filled" sx={{ borderRadius: "50%" }}>
          5
        </Label>
      </div>
    </div>
  ),
};
