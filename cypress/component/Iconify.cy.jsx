import { Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Iconify from "../../src/components/Iconify/Iconify";
import React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4, minHeight: "100vh" }}>{children}</Box>
    </ThemeProvider>
  </BrowserRouter>
);

describe("Iconify Component", () => {
  it("renders with default props", () => {
    cy.mount(
      <TestWrapper>
        <Iconify icon="mdi:home" data-testid="iconify-default" />
      </TestWrapper>
    );

    cy.get('[data-testid="iconify-default"]')
      .should("exist")
      .and("have.class", "component-iconify");

    cy.get('[data-testid="iconify-default"]')
      .should("have.css", "width", "20px")
      .and("have.css", "height", "20px");
  });

  it("renders with custom width", () => {
    cy.mount(
      <TestWrapper>
        <Iconify
          icon="mdi:star"
          width={40}
          data-testid="iconify-custom-width"
        />
      </TestWrapper>
    );

    cy.get('[data-testid="iconify-custom-width"]')
      .should("have.css", "width", "40px")
      .and("have.css", "height", "40px");
  });

  it("applies custom sx styles", () => {
    const customSx = {
      color: "red",
      fontSize: "24px",
    };

    cy.mount(
      <TestWrapper>
        <Iconify
          icon="mdi:heart"
          sx={customSx}
          data-testid="iconify-custom-sx"
        />
      </TestWrapper>
    );

    cy.get('[data-testid="iconify-custom-sx"]')
      .should("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "font-size", "24px");
  });

  it("forwards ref correctly", () => {
    const RefTestComponent = () => {
      const iconRef = React.useRef(null);

      const handleClick = () => {
        if (iconRef.current) {
          iconRef.current.style.transform = "rotate(45deg)";
        }
      };

      return (
        <div>
          <Iconify
            ref={iconRef}
            icon="mdi:settings"
            data-testid="iconify-with-ref"
          />
          <button onClick={handleClick} data-testid="rotate-button">
            Rotate Icon
          </button>
        </div>
      );
    };

    cy.mount(
      <TestWrapper>
        <RefTestComponent />
      </TestWrapper>
    );

    cy.get('[data-testid="iconify-with-ref"]').should(
      "not.have.css",
      "transform",
      "matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)"
    );

    cy.get('[data-testid="rotate-button"]').click();

    cy.get('[data-testid="iconify-with-ref"]').should(
      "have.css",
      "transform",
      "matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)"
    );
  });

  it("passes through additional props", () => {
    cy.mount(
      <TestWrapper>
        <Iconify
          icon="mdi:check"
          title="Check Icon"
          onClick={() => console.log("clicked")}
          data-testid="iconify-with-props"
          role="button"
        />
      </TestWrapper>
    );

    cy.get('[data-testid="iconify-with-props"]')
      .should("have.attr", "title", "Check Icon")
      .and("have.attr", "role", "button");
  });

  it("renders different icon types correctly", () => {
    const iconTypes = [
      { icon: "mdi:home", testId: "mdi-icon" },
      { icon: "eva:star-fill", testId: "eva-icon" },
      { icon: "solar:heart-bold", testId: "solar-icon" },
      { icon: "ic:round-favorite", testId: "ic-icon" },
    ];

    cy.mount(
      <TestWrapper>
        <div style={{ display: "flex", gap: "16px" }}>
          {iconTypes.map(({ icon, testId }) => (
            <Iconify key={testId} icon={icon} data-testid={testId} width={32} />
          ))}
        </div>
      </TestWrapper>
    );

    iconTypes.forEach(({ testId }) => {
      cy.get(`[data-testid="${testId}"]`)
        .should("exist")
        .and("have.class", "component-iconify")
        .and("have.css", "width", "32px");
    });
  });

  it("combines width and sx styles correctly", () => {
    cy.mount(
      <TestWrapper>
        <Iconify
          icon="mdi:palette"
          width={50}
          sx={{
            color: "blue",
            border: "2px solid green",
            borderRadius: "50%",
          }}
          data-testid="iconify-combined-styles"
        />
      </TestWrapper>
    );

    cy.get('[data-testid="iconify-combined-styles"]')
      .should("have.css", "width", "50px")
      .and("have.css", "height", "50px")
      .and("have.css", "color", "rgb(0, 0, 255)") // blue
      .and("have.css", "border", "2px solid rgb(0, 128, 0)") // green border
      .and("have.css", "border-radius", "50%");
  });

  it("maintains accessibility attributes", () => {
    cy.mount(
      <TestWrapper>
        <Iconify
          icon="mdi:accessibility"
          data-testid="iconify-a11y"
          aria-label="Accessibility icon"
          role="img"
        />
      </TestWrapper>
    );

    cy.get('[data-testid="iconify-a11y"]')
      .should("have.attr", "aria-label", "Accessibility icon")
      .and("have.attr", "role", "img");
  });

  it("works with event handlers", () => {
    const handleClick = cy.stub().as("handleClick");
    const handleMouseEnter = cy.stub().as("handleMouseEnter");

    cy.mount(
      <TestWrapper>
        <Iconify
          icon="mdi:cursor-default-click"
          data-testid="iconify-events"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          sx={{ cursor: "pointer" }}
        />
      </TestWrapper>
    );

    cy.get('[data-testid="iconify-events"]').should(
      "have.css",
      "cursor",
      "pointer"
    );

    cy.get('[data-testid="iconify-events"]').click();
    cy.get("@handleClick").should("have.been.called");
  });
});
