import Box from "@mui/material/Box";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { fn } from "@storybook/test";

import {
  NavSectionHorizontal,
  NavSectionMini,
  NavSectionVertical,
} from "../components/nav-section";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
  },
});

const mockNavData = [
  {
    subheader: "Management",
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: "material-symbols:dashboard",
      },
      {
        title: "User Management",
        path: "/users",
        icon: "material-symbols:people",
        info: "12",
        children: [
          {
            title: "All Users",
            path: "/users/all",
          },
          {
            title: "Active Users",
            path: "/users/active",
          },
          {
            title: "Pending Users",
            path: "/users/pending",
            info: "3",
          },
        ],
      },
      {
        title: "Analytics",
        path: "/analytics",
        icon: "material-symbols:analytics",
        caption: "View detailed reports",
      },
    ],
  },
  {
    subheader: "Content",
    items: [
      {
        title: "Posts",
        path: "/posts",
        icon: "material-symbols:article",
        children: [
          {
            title: "All Posts",
            path: "/posts/all",
          },
          {
            title: "Published",
            path: "/posts/published",
          },
          {
            title: "Drafts",
            path: "/posts/drafts",
            info: "5",
          },
        ],
      },
      {
        title: "Media Library",
        path: "/media",
        icon: "material-symbols:photo-library",
      },
      {
        title: "Categories",
        path: "/categories",
        icon: "material-symbols:category",
      },
    ],
  },
  {
    items: [
      {
        title: "Settings",
        path: "/settings",
        icon: "material-symbols:settings",
      },
      {
        title: "Help Center",
        path: "https://help.example.com",
        icon: "material-symbols:help",
        external: true,
      },
      {
        title: "Admin Only",
        path: "/admin",
        icon: "material-symbols:admin-panel-settings",
        roles: ["admin"],
      },
      {
        title: "Disabled Item",
        path: "/disabled",
        icon: "material-symbols:block",
        disabled: true,
      },
    ],
  },
];

const simpleNavData = [
  {
    items: [
      {
        title: "Home",
        path: "/",
        icon: "material-symbols:home",
      },
      {
        title: "About",
        path: "/about",
        icon: "material-symbols:info",
      },
      {
        title: "Contact",
        path: "/contact",
        icon: "material-symbols:contact-mail",
      },
      {
        title: "Services",
        path: "/services",
        icon: "material-symbols:work",
      },
    ],
  },
];

const minimalNavData = [
  {
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: "material-symbols:dashboard",
      },
      {
        title: "Profile",
        path: "/profile",
        icon: "material-symbols:person",
      },
      {
        title: "Messages",
        path: "/messages",
        icon: "material-symbols:mail",
        info: "3",
      },
      {
        title: "Settings",
        path: "/settings",
        icon: "material-symbols:settings",
      },
    ],
  },
];

const StoryWrapper = ({ children, width = "300px", theme = lightTheme }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width,
          minHeight: "400px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor:
            theme.palette.mode === "dark" ? "#1e1e1e" : "#fafafa",
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  </BrowserRouter>
);

export default {
  title: "Components/NavSection",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Navigation section components that provide different layouts for navigation menus:

- **NavSectionVertical**: Traditional sidebar navigation with collapsible groups and nested items
- **NavSectionHorizontal**: Horizontal navigation bar suitable for top navigation
- **NavSectionMini**: Compact navigation with minimal spacing, ideal for mini sidebars

All components support:
- Nested navigation items
- Role-based access control
- External links
- Info badges
- Icons and captions
- Active state management
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      control: "object",
      description: "Navigation data structure with groups and items",
    },
    slotProps: {
      control: "object",
      description: "Additional props for customizing appearance",
    },
  },
  args: { onClick: fn() },
};

export const VerticalDefault = {
  render: (args) => (
    <StoryWrapper>
      <NavSectionVertical {...args} />
    </StoryWrapper>
  ),
  args: {
    data: mockNavData,
  },
};

export const VerticalSimple = {
  render: (args) => (
    <StoryWrapper>
      <NavSectionVertical {...args} />
    </StoryWrapper>
  ),
  args: {
    data: simpleNavData,
  },
};

export const VerticalWithCustomGap = {
  render: (args) => (
    <StoryWrapper>
      <NavSectionVertical {...args} />
    </StoryWrapper>
  ),
  args: {
    data: mockNavData,
    slotProps: {
      gap: 8,
      subheader: {
        color: "primary.main",
        fontWeight: "bold",
      },
    },
  },
};

export const VerticalCompact = {
  render: (args) => (
    <StoryWrapper width="250px">
      <NavSectionVertical {...args} />
    </StoryWrapper>
  ),
  args: {
    data: mockNavData,
    slotProps: {
      gap: 2,
    },
  },
};

// Horizontal Navigation Stories
export const HorizontalDefault = {
  render: (args) => (
    <StoryWrapper width="100%">
      <Box sx={{ p: 2 }}>
        <NavSectionHorizontal {...args} />
      </Box>
    </StoryWrapper>
  ),
  args: {
    data: simpleNavData,
  },
};

export const HorizontalWithSpacing = {
  render: (args) => (
    <StoryWrapper width="100%">
      <Box sx={{ p: 2 }}>
        <NavSectionHorizontal {...args} />
      </Box>
    </StoryWrapper>
  ),
  args: {
    data: simpleNavData,
    slotProps: {
      gap: 12,
    },
  },
};

export const HorizontalCompact = {
  render: (args) => (
    <StoryWrapper width="100%">
      <Box sx={{ p: 1 }}>
        <NavSectionHorizontal {...args} />
      </Box>
    </StoryWrapper>
  ),
  args: {
    data: simpleNavData,
    slotProps: {
      gap: 4,
    },
  },
};

export const MiniDefault = {
  render: (args) => (
    <StoryWrapper width="80px">
      <NavSectionMini {...args} />
    </StoryWrapper>
  ),
  args: {
    data: minimalNavData,
  },
};

export const MiniWithBadges = {
  render: (args) => (
    <StoryWrapper width="80px">
      <NavSectionMini {...args} />
    </StoryWrapper>
  ),
  args: {
    data: [
      {
        items: [
          {
            title: "Dashboard",
            path: "/dashboard",
            icon: "material-symbols:dashboard",
          },
          {
            title: "Messages",
            path: "/messages",
            icon: "material-symbols:mail",
            info: "99+",
          },
          {
            title: "Notifications",
            path: "/notifications",
            icon: "material-symbols:notifications",
            info: "5",
          },
          {
            title: "Settings",
            path: "/settings",
            icon: "material-symbols:settings",
          },
        ],
      },
    ],
  },
};

export const MiniCustomSpacing = {
  render: (args) => (
    <StoryWrapper width="80px">
      <NavSectionMini {...args} />
    </StoryWrapper>
  ),
  args: {
    data: minimalNavData,
    slotProps: {
      gap: 8,
    },
  },
};

export const InteractiveComparison = {
  render: () => (
    <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
      <Box>
        <Box sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
          Vertical
        </Box>
        <StoryWrapper width="280px">
          <NavSectionVertical data={mockNavData} />
        </StoryWrapper>
      </Box>

      <Box>
        <Box sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>Mini</Box>
        <StoryWrapper width="80px">
          <NavSectionMini data={minimalNavData} />
        </StoryWrapper>
      </Box>

      <Box>
        <Box sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
          Horizontal
        </Box>
        <StoryWrapper width="600px">
          <Box sx={{ p: 2 }}>
            <NavSectionHorizontal data={simpleNavData} />
          </Box>
        </StoryWrapper>
      </Box>
    </Box>
  ),
};

export const RoleBasedAccess = {
  render: () => (
    <Box sx={{ display: "flex", gap: 3 }}>
      <Box>
        <Box sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
          Admin View
        </Box>
        <StoryWrapper>
          <NavSectionVertical
            data={[
              {
                subheader: "Admin Panel",
                items: [
                  {
                    title: "User Management",
                    path: "/admin/users",
                    icon: "material-symbols:people",
                    roles: ["admin"],
                  },
                  {
                    title: "System Settings",
                    path: "/admin/settings",
                    icon: "material-symbols:admin-panel-settings",
                    roles: ["admin"],
                  },
                  {
                    title: "Reports",
                    path: "/reports",
                    icon: "material-symbols:analytics",
                    roles: ["admin", "manager"],
                  },
                  {
                    title: "Profile",
                    path: "/profile",
                    icon: "material-symbols:person",
                  },
                ],
              },
            ]}
          />
        </StoryWrapper>
      </Box>

      <Box>
        <Box sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
          User View (Admin items hidden)
        </Box>
        <StoryWrapper>
          <NavSectionVertical
            data={[
              {
                subheader: "User Panel",
                items: [
                  {
                    title: "User Management",
                    path: "/admin/users",
                    icon: "material-symbols:people",
                    roles: ["admin"],
                  },
                  {
                    title: "System Settings",
                    path: "/admin/settings",
                    icon: "material-symbols:admin-panel-settings",
                    roles: ["admin"],
                  },
                  {
                    title: "Reports",
                    path: "/reports",
                    icon: "material-symbols:analytics",
                    roles: ["admin", "manager"],
                  },
                  {
                    title: "Profile",
                    path: "/profile",
                    icon: "material-symbols:person",
                  },
                ],
              },
            ]}
          />
        </StoryWrapper>
      </Box>
    </Box>
  ),
};

export const WithExternalLinks = {
  render: (args) => (
    <StoryWrapper>
      <NavSectionVertical {...args} />
    </StoryWrapper>
  ),
  args: {
    data: [
      {
        subheader: "Internal Links",
        items: [
          {
            title: "Dashboard",
            path: "/dashboard",
            icon: "material-symbols:dashboard",
          },
          {
            title: "Settings",
            path: "/settings",
            icon: "material-symbols:settings",
          },
        ],
      },
      {
        subheader: "External Links",
        items: [
          {
            title: "Documentation",
            path: "https://docs.example.com",
            icon: "material-symbols:description",
            external: true,
          },
          {
            title: "Support",
            path: "https://support.example.com",
            icon: "material-symbols:support",
            external: true,
          },
          {
            title: "GitHub",
            path: "https://github.com/example/repo",
            icon: "material-symbols:code",
            external: true,
          },
        ],
      },
    ],
  },
};

export const DarkTheme = {
  render: (args) => (
    <StoryWrapper theme={darkTheme}>
      <NavSectionVertical {...args} />
    </StoryWrapper>
  ),
  args: {
    data: mockNavData,
  },
};
