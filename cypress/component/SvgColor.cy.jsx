import { Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import SvgColor from "../../src/components/svg-color/svg-color";

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

const mockSvgDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMSA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDMgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPHN2Zz4K";

describe("SvgColor Component", () => {
  it("renders with default props", () => {
    cy.mount(
      <TestWrapper>
        <SvgColor src={mockSvgDataUrl} data-testid="svgcolor-default" />
      </TestWrapper>
    );

    cy.get('[data-testid="svgcolor-default"]')
      .should("exist")
      .and("have.class", "svg-color");

    cy.get('[data-testid="svgcolor-default"]')
      .should("have.css", "width", "24px")
      .and("have.css", "height", "24px")
      .and("have.css", "display", "inline-block");
  });

  it("applies custom dimensions via sx prop", () => {
    cy.mount(
      <TestWrapper>
        <SvgColor
          src={mockSvgDataUrl}
          sx={{ width: 48, height: 48 }}
          data-testid="svgcolor-custom-size"
        />
      </TestWrapper>
    );

    cy.get('[data-testid="svgcolor-custom-size"]')
      .should("have.css", "width", "48px")
      .and("have.css", "height", "48px");
  });

  it("uses currentColor as background color", () => {
    cy.mount(
      <TestWrapper>
        <Box sx={{ color: "red" }}>
          <SvgColor src={mockSvgDataUrl} data-testid="svgcolor-current-color" />
        </Box>
      </TestWrapper>
    );

    cy.get('[data-testid="svgcolor-current-color"]').should(
      "have.css",
      "background-color",
      "rgb(255, 0, 0)"
    );
  });

  it("applies custom sx styles correctly", () => {
    const customSx = {
      width: 32,
      height: 32,
      borderRadius: "50%",
      border: "2px solid blue",
    };

    cy.mount(
      <TestWrapper>
        <SvgColor
          src={mockSvgDataUrl}
          sx={customSx}
          data-testid="svgcolor-custom-sx"
        />
      </TestWrapper>
    );

    cy.get('[data-testid="svgcolor-custom-sx"]')
      .should("have.css", "width", "32px")
      .and("have.css", "height", "32px")
      .and("have.css", "border-radius", "50%")
      .and("have.css", "border", "2px solid rgb(0, 0, 255)");
  });

  it("forwards ref correctly", () => {
    const RefTestComponent = () => {
      const svgRef = React.useRef(null);

      const handleClick = () => {
        if (svgRef.current) {
          svgRef.current.style.transform = "scale(1.5)";
        }
      };

      return (
        <div>
          <SvgColor
            ref={svgRef}
            src={mockSvgDataUrl}
            data-testid="svgcolor-with-ref"
          />
          <button onClick={handleClick} data-testid="scale-button">
            Scale SVG
          </button>
        </div>
      );
    };

    cy.mount(
      <TestWrapper>
        <RefTestComponent />
      </TestWrapper>
    );

    cy.get('[data-testid="svgcolor-with-ref"]').should(
      "not.have.css",
      "transform",
      "matrix(1.5, 0, 0, 1.5, 0, 0)"
    );

    cy.get('[data-testid="scale-button"]').click();

    cy.get('[data-testid="svgcolor-with-ref"]').should(
      "have.css",
      "transform",
      "matrix(1.5, 0, 0, 1.5, 0, 0)"
    );
  });

  it("passes through additional props", () => {
    cy.mount(
      <TestWrapper>
        <SvgColor
          src={mockSvgDataUrl}
          title="Custom SVG Icon"
          role="img"
          aria-label="Star icon"
          data-testid="svgcolor-with-props"
        />
      </TestWrapper>
    );

    cy.get('[data-testid="svgcolor-with-props"]')
      .should("have.attr", "title", "Custom SVG Icon")
      .and("have.attr", "role", "img")
      .and("have.attr", "aria-label", "Star icon");
  });

  it("renders as Box component with span element", () => {
    cy.mount(
      <TestWrapper>
        <SvgColor src={mockSvgDataUrl} data-testid="svgcolor-element-check" />
      </TestWrapper>
    );

    cy.get('[data-testid="svgcolor-element-check"]').should(
      "have.prop",
      "tagName",
      "SPAN"
    );
  });

  it("works with event handlers", () => {
    const handleClick = cy.stub().as("handleClick");
    const handleMouseEnter = cy.stub().as("handleMouseEnter");

    cy.mount(
      <TestWrapper>
        <SvgColor
          src={mockSvgDataUrl}
          data-testid="svgcolor-events"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          sx={{ cursor: "pointer" }}
        />
      </TestWrapper>
    );

    cy.get('[data-testid="svgcolor-events"]').should(
      "have.css",
      "cursor",
      "pointer"
    );

    cy.get('[data-testid="svgcolor-events"]').click();
    cy.get("@handleClick").should("have.been.called");

    cy.get('[data-testid="svgcolor-events"]').trigger("mouseenter");
    cy.get("@handleMouseEnter").should("have.been.called");
  });

  it("handles different src formats", () => {
    const srcFormats = [
      { src: "/assets/icon.svg", testId: "relative-path" },
      { src: "https://example.com/icon.svg", testId: "absolute-url" },
      { src: mockSvgDataUrl, testId: "data-url" },
    ];

    cy.mount(
      <TestWrapper>
        <div style={{ display: "flex", gap: "16px" }}>
          {srcFormats.map(({ src, testId }) => (
            <SvgColor key={testId} src={src} data-testid={testId} />
          ))}
        </div>
      </TestWrapper>
    );

    srcFormats.forEach(({ testId }) => {
      cy.get(`[data-testid="${testId}"]`)
        .should("exist")
        .and("have.class", "svg-color");
    });
  });

  it("maintains aspect ratio with different dimensions", () => {
    cy.mount(
      <TestWrapper>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <SvgColor
            src={mockSvgDataUrl}
            sx={{ width: 16, height: 16 }}
            data-testid="svgcolor-16"
          />
          <SvgColor
            src={mockSvgDataUrl}
            sx={{ width: 32, height: 32 }}
            data-testid="svgcolor-32"
          />
          <SvgColor
            src={mockSvgDataUrl}
            sx={{ width: 64, height: 64 }}
            data-testid="svgcolor-64"
          />
        </div>
      </TestWrapper>
    );

    const sizes = [
      { testId: "svgcolor-16", size: "16px" },
      { testId: "svgcolor-32", size: "32px" },
      { testId: "svgcolor-64", size: "64px" },
    ];

    sizes.forEach(({ testId, size }) => {
      cy.get(`[data-testid="${testId}"]`)
        .should("have.css", "width", size)
        .and("have.css", "height", size);
    });
  });

  it("works with different color contexts", () => {
    cy.mount(
      <TestWrapper>
        <div style={{ display: "flex", gap: "16px" }}>
          <Box sx={{ color: "red" }}>
            <SvgColor src={mockSvgDataUrl} data-testid="svgcolor-red-context" />
          </Box>
          <Box sx={{ color: "green" }}>
            <SvgColor
              src={mockSvgDataUrl}
              data-testid="svgcolor-green-context"
            />
          </Box>
          <Box sx={{ color: "#ff6b35" }}>
            <SvgColor
              src={mockSvgDataUrl}
              data-testid="svgcolor-custom-context"
            />
          </Box>
        </div>
      </TestWrapper>
    );

    cy.get('[data-testid="svgcolor-red-context"]').should(
      "have.css",
      "background-color",
      "rgb(255, 0, 0)"
    );

    cy.get('[data-testid="svgcolor-green-context"]').should(
      "have.css",
      "background-color",
      "rgb(0, 128, 0)"
    );

    cy.get('[data-testid="svgcolor-custom-context"]').should(
      "have.css",
      "background-color",
      "rgb(255, 107, 53)"
    );
  });

  it("maintains accessibility with proper attributes", () => {
    cy.mount(
      <TestWrapper>
        <SvgColor
          src={mockSvgDataUrl}
          data-testid="svgcolor-a11y"
          role="img"
          aria-label="Decorative star icon"
          tabIndex={0}
        />
      </TestWrapper>
    );

    cy.get('[data-testid="svgcolor-a11y"]')
      .should("have.attr", "role", "img")
      .and("have.attr", "aria-label", "Decorative star icon")
      .and("have.attr", "tabindex", "0");
  });
});
