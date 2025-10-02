import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";

import {
  NavSectionHorizontal,
  NavSectionMini,
  NavSectionVertical,
} from "../../src/components/nav-section";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const mockNavData = [
  {
    subheader: "General",
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: "eva:pie-chart-2-fill",
      },
      {
        title: "Analytics",
        path: "/analytics",
        icon: "eva:bar-chart-fill",
        info: "New",
      },
      {
        title: "User Management",
        path: "/users",
        icon: "eva:people-fill",
        children: [
          {
            title: "List Users",
            path: "/users/list",
          },
          {
            title: "Add User",
            path: "/users/add",
          },
        ],
      },
    ],
  },
  {
    subheader: "Settings",
    items: [
      {
        title: "Profile",
        path: "/profile",
        icon: "eva:person-fill",
      },
      {
        title: "System",
        path: "/system",
        icon: "eva:settings-2-fill",
        disabled: true,
      },
    ],
  },
];

const mockNavDataWithoutSubheader = [
  {
    items: [
      {
        title: "Home",
        path: "/",
        icon: "eva:home-fill",
      },
      {
        title: "About",
        path: "/about",
        icon: "eva:info-fill",
      },
    ],
  },
];

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

describe("NavSection Components", () => {
  describe("NavSectionVertical", () => {
    it("renders vertical navigation with subheaders", () => {
      cy.mount(
        <TestWrapper>
          <NavSectionVertical data={mockNavData} />
        </TestWrapper>
      );

      cy.get("#nav-section-vertical").should("exist");

      cy.contains("General").should("be.visible");
      cy.contains("Settings").should("be.visible");

      cy.contains("Dashboard").should("be.visible");
      cy.contains("Analytics").should("be.visible");
      cy.contains("User Management").should("be.visible");
      cy.contains("Profile").should("be.visible");
      cy.contains("System").should("be.visible");
    });

    it("toggles subheader sections when clicked", () => {
      cy.mount(
        <TestWrapper>
          <NavSectionVertical data={mockNavData} />
        </TestWrapper>
      );

      cy.contains("Dashboard").should("be.visible");

      cy.contains("General").click();

      cy.contains("Dashboard").should("not.be.visible");

      cy.contains("General").click();

      cy.contains("Dashboard").should("be.visible");
    });

    it("renders navigation items with icons and info badges", () => {
      cy.mount(
        <TestWrapper>
          <NavSectionVertical data={mockNavData} />
        </TestWrapper>
      );

      cy.contains("Analytics").parent().should("contain", "New");

      cy.contains("System").should("exist");
    });

    it("handles data without subheaders", () => {
      cy.mount(
        <TestWrapper>
          <NavSectionVertical data={mockNavDataWithoutSubheader} />
        </TestWrapper>
      );

      cy.get("#nav-section-vertical").should("exist");
      cy.contains("Home").should("be.visible");
      cy.contains("About").should("be.visible");
    });

    it("applies custom slot props", () => {
      const customSlotProps = {
        gap: 8,
        subheader: {
          color: "primary.main",
        },
      };

      cy.mount(
        <TestWrapper>
          <NavSectionVertical data={mockNavData} slotProps={customSlotProps} />
        </TestWrapper>
      );

      cy.get("#nav-section-vertical").should("exist");
    });

    it("expands and collapses nested menu items", () => {
      cy.mount(
        <TestWrapper>
          <NavSectionVertical data={mockNavData} />
        </TestWrapper>
      );

      cy.contains("List Users").should("not.exist");

      cy.contains("User Management").click();

      cy.contains("List Users").should("be.visible");
      cy.contains("Add User").should("be.visible");

      cy.contains("User Management").click();

      cy.contains("List Users").should("not.exist");
    });
  });

  describe("NavSectionMini", () => {
    it("renders mini navigation without subheaders", () => {
      cy.mount(
        <TestWrapper>
          <NavSectionMini data={mockNavData} />
        </TestWrapper>
      );

      cy.get("#nav-section-mini").should("exist");

      cy.contains("General").should("not.exist");
      cy.contains("Settings").should("not.exist");

      cy.contains("Dashboard").should("be.visible");
      cy.contains("Profile").should("be.visible");
    });

    it("applies custom spacing from slot props", () => {
      const customSlotProps = {
        gap: 12,
      };

      cy.mount(
        <TestWrapper>
          <NavSectionMini data={mockNavData} slotProps={customSlotProps} />
        </TestWrapper>
      );

      cy.get("#nav-section-mini").should("exist");
    });

    it("renders all navigation items in compact format", () => {
      cy.mount(
        <TestWrapper>
          <NavSectionMini data={mockNavData} />
        </TestWrapper>
      );

      cy.contains("Dashboard").should("be.visible");
      cy.contains("Analytics").should("be.visible");
      cy.contains("User Management").should("be.visible");
      cy.contains("Profile").should("be.visible");
      cy.contains("System").should("be.visible");
    });
  });

  describe("NavSectionHorizontal", () => {
    it("renders horizontal navigation layout", () => {
      cy.mount(
        <TestWrapper>
          <NavSectionHorizontal data={mockNavData} />
        </TestWrapper>
      );

      cy.get("#nav-section-horizontal").should("exist");

      cy.get("#nav-section-horizontal").should(
        "have.css",
        "flex-direction",
        "row"
      );

      cy.contains("Dashboard").should("be.visible");
      cy.contains("Profile").should("be.visible");
    });

    it("applies custom spacing and styles", () => {
      const customSlotProps = {
        gap: 10,
      };

      const customSx = {
        backgroundColor: "background.paper",
      };

      cy.mount(
        <TestWrapper>
          <NavSectionHorizontal
            data={mockNavData}
            slotProps={customSlotProps}
            sx={customSx}
          />
        </TestWrapper>
      );

      cy.get("#nav-section-horizontal").should("exist");
    });

    it("centers content horizontally", () => {
      cy.mount(
        <TestWrapper>
          <NavSectionHorizontal data={mockNavDataWithoutSubheader} />
        </TestWrapper>
      );

      cy.get("#nav-section-horizontal").should(
        "have.css",
        "align-items",
        "center"
      );
    });

    it("renders items in horizontal alignment", () => {
      cy.mount(
        <TestWrapper>
          <NavSectionHorizontal data={mockNavDataWithoutSubheader} />
        </TestWrapper>
      );

      cy.contains("Home").should("be.visible");
      cy.contains("About").should("be.visible");

      cy.get("#nav-section-horizontal").within(() => {
        cy.contains("Home").should("exist");
        cy.contains("About").should("exist");
      });
    });
  });

  describe("Common Navigation Functionality", () => {
    it("handles empty data gracefully", () => {
      cy.mount(
        <TestWrapper>
          <NavSectionVertical data={[]} />
        </TestWrapper>
      );

      cy.get("#nav-section-vertical").should("exist");
    });

    it("handles navigation items with external links", () => {
      const externalLinkData = [
        {
          items: [
            {
              title: "External Link",
              path: "https://example.com",
              icon: "eva:external-link-fill",
              external: true,
            },
          ],
        },
      ];

      cy.mount(
        <TestWrapper>
          <NavSectionVertical data={externalLinkData} />
        </TestWrapper>
      );

      cy.contains("External Link").should("be.visible");
    });
  });
});
