import { Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Iconify from "../../src/components/Iconify/Iconify";
import Label from "../../src/components/label/label";
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

describe("Label Component", () => {
  it("renders with default props", () => {
    cy.mount(
      <TestWrapper>
        <Label data-testid="label-default">Default Label</Label>
      </TestWrapper>
    );

    cy.get('[data-testid="label-default"]')
      .should("exist")
      .and("contain.text", "Default Label")
      .and("have.prop", "tagName", "SPAN");

    cy.get('[data-testid="label-default"]')
      .should("have.css", "height", "24px")
      .and("have.css", "border-radius", "6px")
      .and("have.css", "display", "inline-flex")
      .and("have.css", "align-items", "center")
      .and("have.css", "justify-content", "center")
      .and("have.css", "text-transform", "capitalize");
  });

  it("renders with custom text content", () => {
    cy.mount(
      <TestWrapper>
        <Label data-testid="label-custom-text">Custom Text Content</Label>
      </TestWrapper>
    );

    cy.get('[data-testid="label-custom-text"]').should(
      "contain.text",
      "Custom Text Content"
    );
  });

  describe("Variants", () => {
    it("renders soft variant correctly", () => {
      cy.mount(
        <TestWrapper>
          <Label variant="soft" data-testid="label-soft">
            Soft Variant
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-soft"]')
        .should("exist")
        .and("contain.text", "Soft Variant");
    });

    it("renders filled variant correctly", () => {
      cy.mount(
        <TestWrapper>
          <Label variant="filled" data-testid="label-filled">
            Filled Variant
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-filled"]')
        .should("exist")
        .and("contain.text", "Filled Variant");
    });

    it("renders outlined variant correctly", () => {
      cy.mount(
        <TestWrapper>
          <Label variant="outlined" data-testid="label-outlined">
            Outlined Variant
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-outlined"]')
        .should("exist")
        .and("contain.text", "Outlined Variant")
        .and("have.css", "background-color", "rgba(0, 0, 0, 0)");
    });
  });

  describe("Colors", () => {
    const colors = [
      "default",
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
    ];

    colors.forEach((color) => {
      it(`renders ${color} color correctly`, () => {
        cy.mount(
          <TestWrapper>
            <Label color={color} data-testid={`label-${color}`}>
              {color} Color
            </Label>
          </TestWrapper>
        );

        cy.get(`[data-testid="label-${color}"]`)
          .should("exist")
          .and("contain.text", `${color} Color`);
      });
    });

    it("renders all colors in filled variant", () => {
      cy.mount(
        <TestWrapper>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {colors.map((color) => (
              <Label
                key={color}
                color={color}
                variant="filled"
                data-testid={`label-filled-${color}`}
              >
                {color}
              </Label>
            ))}
          </div>
        </TestWrapper>
      );

      colors.forEach((color) => {
        cy.get(`[data-testid="label-filled-${color}"]`)
          .should("exist")
          .and("contain.text", color);
      });
    });
  });

  describe("Icons", () => {
    it("renders with start icon", () => {
      cy.mount(
        <TestWrapper>
          <Label
            startIcon={<Iconify icon="material-symbols:star" width={16} />}
            data-testid="label-start-icon"
          >
            With Start Icon
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-start-icon"]')
        .should("contain.text", "With Start Icon")
        .find(".component-iconify")
        .should("exist")
        .and("have.css", "width", "16px")
        .and("have.css", "height", "16px");
    });

    it("renders with end icon", () => {
      cy.mount(
        <TestWrapper>
          <Label
            endIcon={
              <Iconify icon="material-symbols:arrow-forward" width={16} />
            }
            data-testid="label-end-icon"
          >
            With End Icon
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-end-icon"]')
        .should("contain.text", "With End Icon")
        .find(".component-iconify")
        .should("exist")
        .and("have.css", "width", "16px")
        .and("have.css", "height", "16px");
    });

    it("renders with both start and end icons", () => {
      cy.mount(
        <TestWrapper>
          <Label
            startIcon={<Iconify icon="material-symbols:favorite" width={16} />}
            endIcon={<Iconify icon="material-symbols:check" width={16} />}
            data-testid="label-both-icons"
          >
            Both Icons
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-both-icons"]')
        .should("contain.text", "Both Icons")
        .find(".component-iconify")
        .should("have.length", 2);
    });

    it("applies correct padding when icons are present", () => {
      cy.mount(
        <TestWrapper>
          <div style={{ display: "flex", gap: "16px" }}>
            <Label data-testid="label-no-icon">No Icon</Label>
            <Label
              startIcon={<Iconify icon="material-symbols:star" width={16} />}
              data-testid="label-with-start"
            >
              Start Icon
            </Label>
            <Label
              endIcon={<Iconify icon="material-symbols:star" width={16} />}
              data-testid="label-with-end"
            >
              End Icon
            </Label>
          </div>
        </TestWrapper>
      );

      cy.get('[data-testid="label-with-start"]').should(
        "have.css",
        "padding-left",
        "6px"
      );

      cy.get('[data-testid="label-with-end"]').should(
        "have.css",
        "padding-right",
        "6px"
      );
    });
  });

  describe("Custom Styling", () => {
    it("applies custom sx styles correctly", () => {
      const customSx = {
        borderRadius: 2,
        fontSize: 14,
        fontWeight: 600,
        textTransform: "uppercase",
        px: 2,
        py: 1,
        backgroundColor: "red",
        color: "white",
      };

      cy.mount(
        <TestWrapper>
          <Label sx={customSx} data-testid="label-custom-sx">
            Custom Styled
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-custom-sx"]')
        .should("have.css", "border-radius", "8px") // 2 * 4px
        .and("have.css", "font-size", "14px")
        .and("have.css", "font-weight", "600")
        .and("have.css", "text-transform", "uppercase")
        .and("have.css", "background-color", "rgb(255, 0, 0)")
        .and("have.css", "color", "rgb(255, 255, 255)");
    });

    it("combines variant styles with custom sx", () => {
      cy.mount(
        <TestWrapper>
          <Label
            variant="outlined"
            color="primary"
            sx={{ borderWidth: "3px", borderStyle: "dashed" }}
            data-testid="label-combined-styles"
          >
            Combined Styles
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-combined-styles"]')
        .should("have.css", "border-width", "3px")
        .and("have.css", "border-style", "dashed");
    });
  });

  describe("Accessibility", () => {
    it("forwards accessibility attributes correctly", () => {
      cy.mount(
        <TestWrapper>
          <Label
            role="status"
            aria-label="Status indicator"
            tabIndex={0}
            data-testid="label-a11y"
          >
            Accessible Label
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-a11y"]')
        .should("have.attr", "role", "status")
        .and("have.attr", "aria-label", "Status indicator")
        .and("have.attr", "tabindex", "0");
    });

    it("is focusable when tabIndex is set", () => {
      cy.mount(
        <TestWrapper>
          <Label tabIndex={0} data-testid="label-focusable">
            Focusable Label
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-focusable"]').focus().should("be.focused");
    });

    it("supports screen reader text", () => {
      cy.mount(
        <TestWrapper>
          <Label data-testid="label-sr-text">
            Status: <span className="sr-only">Success</span>✓
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-sr-text"]')
        .should("contain.text", "Status:")
        .and("contain.text", "✓");
    });
  });

  describe("Event Handling", () => {
    it("handles click events", () => {
      const handleClick = cy.stub().as("handleClick");

      cy.mount(
        <TestWrapper>
          <Label
            onClick={handleClick}
            sx={{ cursor: "pointer" }}
            data-testid="label-clickable"
          >
            Clickable Label
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-clickable"]')
        .should("have.css", "cursor", "pointer")
        .click();

      cy.get("@handleClick").should("have.been.called");
    });

    it("handles multiple event types", () => {
      const handleClick = cy.stub().as("handleClick");
      const handleMouseEnter = cy.stub().as("handleMouseEnter");

      cy.mount(
        <TestWrapper>
          <Label
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            data-testid="label-events"
          >
            Interactive Label
          </Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-events"]').click().trigger("mouseenter");

      cy.get("@handleClick").should("have.been.called");
      cy.get("@handleMouseEnter").should("have.been.called");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref correctly", () => {
      const RefTestComponent = () => {
        const labelRef = React.useRef(null);

        const handleClick = () => {
          if (labelRef.current) {
            labelRef.current.style.transform = "scale(1.2)";
          }
        };

        return (
          <div>
            <Label ref={labelRef} data-testid="label-with-ref">
              Ref Label
            </Label>
            <button onClick={handleClick} data-testid="transform-button">
              Transform Label
            </button>
          </div>
        );
      };

      cy.mount(
        <TestWrapper>
          <RefTestComponent />
        </TestWrapper>
      );

      cy.get('[data-testid="label-with-ref"]').should(
        "not.have.css",
        "transform",
        "matrix(1.2, 0, 0, 1.2, 0, 0)"
      );

      cy.get('[data-testid="transform-button"]').click();

      cy.get('[data-testid="label-with-ref"]').should(
        "have.css",
        "transform",
        "matrix(1.2, 0, 0, 1.2, 0, 0)"
      );
    });
  });

  describe("Real-world Use Cases", () => {
    it("renders status labels correctly", () => {
      const statuses = [
        {
          text: "Completed",
          color: "success",
          icon: "material-symbols:check-circle",
        },
        {
          text: "Pending",
          color: "warning",
          icon: "material-symbols:schedule",
        },
        { text: "Failed", color: "error", icon: "material-symbols:cancel" },
        { text: "Info", color: "info", icon: "material-symbols:info" },
      ];

      cy.mount(
        <TestWrapper>
          <div style={{ display: "flex", gap: "8px" }}>
            {statuses.map((status) => (
              <Label
                key={status.text}
                variant="filled"
                color={status.color}
                startIcon={<Iconify icon={status.icon} width={16} />}
                data-testid={`status-${status.text.toLowerCase()}`}
              >
                {status.text}
              </Label>
            ))}
          </div>
        </TestWrapper>
      );

      statuses.forEach((status) => {
        cy.get(`[data-testid="status-${status.text.toLowerCase()}"]`)
          .should("exist")
          .and("contain.text", status.text)
          .find(".component-iconify")
          .should("exist");
      });
    });

    it("works as notification badges", () => {
      cy.mount(
        <TestWrapper>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Iconify icon="material-symbols:notifications" width={24} />
            <Label
              variant="filled"
              color="error"
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                minWidth: 20,
                height: 20,
                borderRadius: "50%",
                fontSize: 10,
              }}
              data-testid="notification-badge"
            >
              3
            </Label>
          </div>
        </TestWrapper>
      );

      cy.get('[data-testid="notification-badge"]')
        .should("contain.text", "3")
        .and("have.css", "position", "absolute")
        .and("have.css", "border-radius", "50%")
        .and("have.css", "font-size", "10px");
    });

    it("renders category tags", () => {
      const categories = [
        { name: "Development", color: "info" },
        { name: "Design", color: "success" },
        { name: "Bug", color: "warning" },
        { name: "Critical", color: "error" },
      ];

      cy.mount(
        <TestWrapper>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {categories.map((category) => (
              <Label
                key={category.name}
                variant="soft"
                color={category.color}
                data-testid={`category-${category.name.toLowerCase()}`}
              >
                {category.name}
              </Label>
            ))}
          </div>
        </TestWrapper>
      );

      categories.forEach((category) => {
        cy.get(`[data-testid="category-${category.name.toLowerCase()}"]`)
          .should("exist")
          .and("contain.text", category.name);
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty children gracefully", () => {
      cy.mount(
        <TestWrapper>
          <Label data-testid="label-empty"></Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-empty"]')
        .should("exist")
        .and("have.css", "min-width", "24px");
    });

    it("handles very long text", () => {
      const longText =
        "This is a very long label text that might cause layout issues if not handled properly";

      cy.mount(
        <TestWrapper>
          <div style={{ maxWidth: "200px" }}>
            <Label data-testid="label-long-text">{longText}</Label>
          </div>
        </TestWrapper>
      );

      cy.get('[data-testid="label-long-text"]')
        .should("contain.text", longText)
        .and("have.css", "white-space", "nowrap");
    });

    it("handles single character content", () => {
      cy.mount(
        <TestWrapper>
          <Label data-testid="label-single-char">A</Label>
        </TestWrapper>
      );

      cy.get('[data-testid="label-single-char"]')
        .should("contain.text", "A")
        .and("have.css", "min-width", "24px");
    });

    it("handles special characters and emojis", () => {
      cy.mount(
        <TestWrapper>
          <div style={{ display: "flex", gap: "8px" }}>
            <Label data-testid="label-emoji">🎉 Success</Label>
            <Label data-testid="label-special">@#$%^&*()</Label>
            <Label data-testid="label-unicode">Café ñoño</Label>
          </div>
        </TestWrapper>
      );

      cy.get('[data-testid="label-emoji"]').should(
        "contain.text",
        "🎉 Success"
      );
      cy.get('[data-testid="label-special"]').should(
        "contain.text",
        "@#$%^&*()"
      );
      cy.get('[data-testid="label-unicode"]').should(
        "contain.text",
        "Café ñoño"
      );
    });
  });

  describe("Theme Integration", () => {
    it("responds to theme changes", () => {
      const customTheme = createTheme({
        palette: {
          primary: {
            main: "#ff5722",
          },
        },
      });

      cy.mount(
        <BrowserRouter>
          <ThemeProvider theme={customTheme}>
            <CssBaseline />
            <Box sx={{ p: 4 }}>
              <Label
                variant="filled"
                color="primary"
                data-testid="label-custom-theme"
              >
                Custom Theme
              </Label>
            </Box>
          </ThemeProvider>
        </BrowserRouter>
      );

      cy.get('[data-testid="label-custom-theme"]')
        .should("exist")
        .and("contain.text", "Custom Theme");
    });
  });
});
