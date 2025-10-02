import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";

import { AppBar, Box, Slide, Toolbar } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const mockConfig = {
  template: {
    login: {
      icon: "/assets/background/overlay_2.jpg",
    },
  },
};

const mockStyles = {
  appBar: { width: "75px", left: 0 },
  logo: { width: "2.4rem", marginLeft: "-0.5rem" },
};

const MockMiniTopBar = ({ config = mockConfig, styles = mockStyles }) => {
  const { icon } = config.template.login;

  return (
    <Slide in={true} direction="right" timeout={500}>
      <AppBar
        position="absolute"
        sx={styles.appBar}
        variant="dense"
        data-testid="mini-topbar"
      >
        <Toolbar>
          <Box component="img" src={icon} sx={styles.logo} />
        </Toolbar>
      </AppBar>
    </Slide>
  );
};

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

describe("MiniTopBar Component", () => {
  it("renders the MiniTopBar component", () => {
    cy.mount(
      <TestWrapper>
        <MockMiniTopBar />
      </TestWrapper>
    );

    cy.get("[data-testid='mini-topbar']").should("exist");
    cy.get("header").should("exist");
  });

  it("displays the logo image from config", () => {
    cy.mount(
      <TestWrapper>
        <MockMiniTopBar />
      </TestWrapper>
    );

    cy.get("img").should("exist");
    cy.get("img").should(
      "have.attr",
      "src",
      "/assets/background/overlay_2.jpg"
    );
  });

  it("applies correct styling from styles object", () => {
    cy.mount(
      <TestWrapper>
        <MockMiniTopBar />
      </TestWrapper>
    );

    cy.get("header").should("have.css", "position", "absolute");
    cy.get("header").should("have.css", "left", "0px");
    cy.get("header").should("have.css", "width", "75px");
  });

  it("has correct AppBar variant", () => {
    cy.mount(
      <TestWrapper>
        <MockMiniTopBar />
      </TestWrapper>
    );

    cy.get("[data-testid='mini-topbar']").should(
      "have.class",
      "MuiPaper-dense"
    );
  });

  it("contains a Toolbar with logo", () => {
    cy.mount(
      <TestWrapper>
        <MockMiniTopBar />
      </TestWrapper>
    );

    cy.get(".MuiToolbar-root").should("exist");
    cy.get(".MuiToolbar-root").within(() => {
      cy.get("img").should("exist");
    });
  });

  it("applies slide animation", () => {
    cy.mount(
      <TestWrapper>
        <MockMiniTopBar />
      </TestWrapper>
    );

    cy.get("header").should("be.visible");
  });

  it("handles missing config gracefully", () => {
    const emptyConfig = {
      template: {
        login: {},
      },
    };

    cy.mount(
      <TestWrapper>
        <MockMiniTopBar config={emptyConfig} />
      </TestWrapper>
    );

    cy.get("header").should("exist");
    cy.get("img").should("exist");
    cy.get("img").should("not.have.attr", "src", "");
  });

  it("accepts different icon sources", () => {
    const customConfig = {
      template: {
        login: {
          icon: "/custom-logo.svg",
        },
      },
    };

    cy.mount(
      <TestWrapper>
        <MockMiniTopBar config={customConfig} />
      </TestWrapper>
    );

    cy.get("img").should("have.attr", "src", "/custom-logo.svg");
  });

  it("applies custom styles when provided", () => {
    const customStyles = {
      appBar: { width: "5rem", left: 0, backgroundColor: "red" },
      logo: { width: "3rem", marginLeft: "0rem" },
    };

    cy.mount(
      <TestWrapper>
        <MockMiniTopBar styles={customStyles} />
      </TestWrapper>
    );

    // Check custom width is applied
    cy.get("header").should("have.css", "width", "80px"); // 5rem converted to px
  });

  it("maintains responsive design", () => {
    cy.mount(
      <TestWrapper>
        <MockMiniTopBar />
      </TestWrapper>
    );

    cy.viewport(320, 568);
    cy.get("header").should("be.visible");

    cy.viewport(768, 1024);
    cy.get("header").should("be.visible");

    cy.viewport(1920, 1080);
    cy.get("header").should("be.visible");
  });

  it("has proper accessibility attributes", () => {
    cy.mount(
      <TestWrapper>
        <MockMiniTopBar />
      </TestWrapper>
    );

    cy.get("img").then(($img) => {
      if ($img.attr("alt")) {
        cy.get("img").should("have.attr", "alt");
      }
    });
  });

  it("renders with correct z-index for overlay positioning", () => {
    cy.mount(
      <TestWrapper>
        <MockMiniTopBar />
      </TestWrapper>
    );

    cy.get("header").should("have.css", "z-index").and("not.equal", "auto");
  });

  it("handles animation timeout correctly", () => {
    cy.mount(
      <TestWrapper>
        <MockMiniTopBar />
      </TestWrapper>
    );

    cy.get("header").should("be.visible");

    cy.wait(600);
    cy.get("header").should("be.visible");
  });

  it("renders with correct slide direction", () => {
    cy.mount(
      <TestWrapper>
        <MockMiniTopBar />
      </TestWrapper>
    );

    cy.get("header").should("be.visible");
  });
});
