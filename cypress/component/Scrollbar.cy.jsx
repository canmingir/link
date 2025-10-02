import { Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import Scrollbar from "../../src/components/scrollbar/scrollbar";

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

const LongContent = () => (
  <div>
    {Array.from({ length: 100 }, (_, index) => (
      <div
        key={index}
        style={{ padding: "10px", borderBottom: "1px solid #eee" }}
      >
        Content item {index + 1} - This is a long line of text that should
        create scrollable content when there are many items like this.
      </div>
    ))}
  </div>
);

describe("Scrollbar Component", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it("renders with default props", () => {
    cy.mount(
      <TestWrapper>
        <Box sx={{ height: "200px", width: "300px" }}>
          <Scrollbar data-testid="scrollbar-default">
            <LongContent />
          </Scrollbar>
        </Box>
      </TestWrapper>
    );

    cy.get('[data-testid="scrollbar-default"]').should("exist");

    cy.get('[data-testid="scrollbar-default"]')
      .parent()
      .should("have.css", "flex-grow", "1")
      .and("have.css", "height", "200px")
      .and("have.css", "overflow", "hidden");
  });

  it("renders children content correctly", () => {
    cy.mount(
      <TestWrapper>
        <Box sx={{ height: "200px", width: "300px" }}>
          <Scrollbar data-testid="scrollbar-with-content">
            <div data-testid="test-content">Test Content</div>
          </Scrollbar>
        </Box>
      </TestWrapper>
    );

    cy.get('[data-testid="scrollbar-with-content"]').should("exist");
    cy.get('[data-testid="test-content"]')
      .should("exist")
      .and("contain.text", "Test Content");
  });

  it("applies custom sx styles", () => {
    cy.mount(
      <TestWrapper>
        <Box sx={{ height: "200px", width: "300px" }}>
          <Scrollbar
            data-testid="scrollbar-custom-styles"
            sx={{
              backgroundColor: "red",
              padding: "20px",
            }}
          >
            <div>Content</div>
          </Scrollbar>
        </Box>
      </TestWrapper>
    );

    cy.get('[data-testid="scrollbar-custom-styles"]')
      .should("have.css", "background-color", "rgb(255, 0, 0)")
      .and("have.css", "padding", "20px");
  });

  it("forwards additional props correctly", () => {
    cy.mount(
      <TestWrapper>
        <Box sx={{ height: "200px", width: "300px" }}>
          <Scrollbar
            data-testid="scrollbar-with-props"
            className="custom-scrollbar"
            id="test-scrollbar"
          >
            <div>Content</div>
          </Scrollbar>
        </Box>
      </TestWrapper>
    );

    cy.get('[data-testid="scrollbar-with-props"]')
      .should("have.class", "custom-scrollbar")
      .and("have.id", "test-scrollbar");
  });

  it("handles scrollable content on desktop", () => {
    cy.mount(
      <TestWrapper>
        <Box sx={{ height: "200px", width: "300px", border: "1px solid #ccc" }}>
          <Scrollbar data-testid="scrollbar-desktop">
            <LongContent />
          </Scrollbar>
        </Box>
      </TestWrapper>
    );

    cy.get('[data-testid="scrollbar-desktop"]').should("exist");

    cy.get(".simplebar-wrapper").should("exist");
    cy.get(".simplebar-content-wrapper").should("exist");

    cy.get(".simplebar-content").scrollTo(0, 500, { ensureScrollable: false });

    // // Check scroll position on the content wrapper
    // cy.get(".simplebar-content-wrapper").then(($wrapper) => {
    //   expect($wrapper[0].scrollTop).to.be.greaterThan(0);
    // });
  });

  it("renders as mobile scrollbar on mobile devices", () => {
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });
    });

    cy.mount(
      <TestWrapper>
        <Box sx={{ height: "200px", width: "300px" }}>
          <Scrollbar data-testid="scrollbar-mobile">
            <LongContent />
          </Scrollbar>
        </Box>
      </TestWrapper>
    );

    // On mobile, it should render as a simple Box with overflow: auto
    cy.get('[data-testid="scrollbar-mobile"]')
      .should("exist")
      .and("have.css", "overflow", "auto");

    // SimpleBar elements should NOT be present on mobile
    cy.get(".simplebar-wrapper").should("not.exist");
  });

  it("handles ref forwarding correctly", () => {
    const TestComponent = () => {
      const scrollbarRef = React.useRef(null);

      React.useEffect(() => {
        if (scrollbarRef.current) {
          scrollbarRef.current.setAttribute("data-ref-test", "ref-working");
        }
      }, []);

      return (
        <Box sx={{ height: "200px", width: "300px" }}>
          <Scrollbar ref={scrollbarRef} data-testid="scrollbar-ref">
            <div>Content with ref</div>
          </Scrollbar>
        </Box>
      );
    };

    cy.mount(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    cy.get('[data-testid="scrollbar-ref"]')
      .should("exist")
      .and("have.attr", "data-ref-test", "ref-working");
  });

  it("maintains scroll position during content updates", () => {
    const DynamicContent = () => {
      const [items, setItems] = React.useState(50);

      return (
        <Box sx={{ height: "200px", width: "300px" }}>
          <button
            data-testid="add-items-btn"
            onClick={() => setItems((prev) => prev + 50)}
          >
            Add Items
          </button>
          <Scrollbar data-testid="scrollbar-dynamic">
            {Array.from({ length: items }, (_, index) => (
              <div
                key={index}
                style={{ padding: "10px", borderBottom: "1px solid #eee" }}
              >
                Dynamic item {index + 1}
              </div>
            ))}
          </Scrollbar>
        </Box>
      );
    };

    cy.mount(
      <TestWrapper>
        <DynamicContent />
      </TestWrapper>
    );

    cy.get(".simplebar-content").should("exist");

    cy.get(".simplebar-content").scrollTo(0, 300, { ensureScrollable: false });

    cy.get('[data-testid="add-items-btn"]').click();

    cy.get(".simplebar-content-wrapper").then(($wrapper) => {
      expect($wrapper[0].scrollTop).to.be.greaterThan(0);
    });
  });

  it("applies theme-based scrollbar styling", () => {
    cy.mount(
      <TestWrapper>
        <Box sx={{ height: "200px", width: "300px" }}>
          <Scrollbar data-testid="scrollbar-themed">
            <LongContent />
          </Scrollbar>
        </Box>
      </TestWrapper>
    );

    cy.get(".simplebar-scrollbar").should("exist");

    cy.get(".simplebar-content").scrollTo(0, 100, { ensureScrollable: false });

    cy.get(".simplebar-scrollbar").should("have.css", "opacity");
  });

  it("handles empty content gracefully", () => {
    cy.mount(
      <TestWrapper>
        <Box sx={{ height: "200px", width: "300px" }}>
          <Scrollbar data-testid="scrollbar-empty">{null}</Scrollbar>
        </Box>
      </TestWrapper>
    );

    cy.get('[data-testid="scrollbar-empty"]').should("exist");
  });

  it("handles SSR environment gracefully", () => {
    cy.window().then((win) => {
      Object.defineProperty(win, "navigator", {
        value: undefined,
        configurable: true,
      });
    });

    cy.mount(
      <TestWrapper>
        <Box sx={{ height: "200px", width: "300px" }}>
          <Scrollbar data-testid="scrollbar-ssr">
            <div>SSR Content</div>
          </Scrollbar>
        </Box>
      </TestWrapper>
    );

    cy.get('[data-testid="scrollbar-ssr"]')
      .should("exist")
      .and("have.css", "overflow", "visible");
  });
});
