import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { Box, Button, MenuItem, MenuList, Typography } from "@mui/material";
import CustomPopover, { usePopover } from "../../src/components/custom-popover";
import React, { useState } from "react";
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

const MockPopoverComponent = ({
  arrow = "top-right",
  hiddenArrow = false,
  customSx = {},
  children = null,
}) => {
  const popover = usePopover();

  return (
    <>
      <Button
        data-testid="trigger-button"
        onClick={popover.onOpen}
        variant="contained"
      >
        Open Popover
      </Button>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow={arrow}
        hiddenArrow={hiddenArrow}
        sx={customSx}
        data-testid="custom-popover"
      >
        {children || (
          <MenuList>
            <MenuItem data-testid="menu-item-1">Option 1</MenuItem>
            <MenuItem data-testid="menu-item-2">Option 2</MenuItem>
            <MenuItem data-testid="menu-item-3">Option 3</MenuItem>
          </MenuList>
        )}
      </CustomPopover>
    </>
  );
};

const ControlledPopover = ({
  open,
  anchorEl,
  arrow = "top-right",
  hiddenArrow = false,
  children,
  ...props
}) => (
  <CustomPopover
    open={open}
    anchorEl={anchorEl}
    arrow={arrow}
    hiddenArrow={hiddenArrow}
    data-testid="controlled-popover"
    {...props}
  >
    {children || (
      <Box sx={{ p: 2 }}>
        <Typography>Popover Content</Typography>
      </Box>
    )}
  </CustomPopover>
);

describe("CustomPopover Component", () => {
  describe("Basic Functionality", () => {
    it("renders without crashing", () => {
      cy.mount(
        <TestWrapper>
          <MockPopoverComponent />
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").should("exist");
    });

    it("opens popover when trigger is clicked", () => {
      cy.mount(
        <TestWrapper>
          <MockPopoverComponent />
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").click();
      cy.get("[data-testid='menu-item-1']").should("be.visible");
      cy.get("[data-testid='menu-item-2']").should("be.visible");
      cy.get("[data-testid='menu-item-3']").should("be.visible");
    });

    it("closes popover when clicking outside", () => {
      cy.mount(
        <TestWrapper>
          <MockPopoverComponent />
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").click();
      cy.get("[data-testid='menu-item-1']").should("be.visible");

      cy.get("body").click(0, 0);
      cy.get("[data-testid='menu-item-1']").should("not.exist");
    });

    it("renders custom content", () => {
      const customContent = (
        <Box sx={{ p: 2 }} data-testid="custom-content">
          <Typography>Custom Popover Content</Typography>
          <Button>Custom Button</Button>
        </Box>
      );

      cy.mount(
        <TestWrapper>
          <MockPopoverComponent>{customContent}</MockPopoverComponent>
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").click();
      cy.get("[data-testid='custom-content']").should("be.visible");
      cy.contains("Custom Popover Content").should("be.visible");
    });
  });

  describe("Arrow Positioning", () => {
    const arrowPositions = [
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
      "left-top",
      "left-center",
      "left-bottom",
      "right-top",
      "right-center",
      "right-bottom",
    ];

    arrowPositions.forEach((arrow) => {
      it(`renders with ${arrow} arrow position`, () => {
        cy.mount(
          <TestWrapper>
            <MockPopoverComponent arrow={arrow} />
          </TestWrapper>
        );

        cy.get("[data-testid='trigger-button']").click();
        cy.get("[data-testid='menu-item-1']").should("be.visible");

        cy.get(".MuiPaper-root").within(() => {
          cy.get("span").should("exist");
        });
      });
    });

    it("defaults to top-right arrow when no arrow prop is provided", () => {
      cy.mount(
        <TestWrapper>
          <MockPopoverComponent />
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").click();
      cy.get("[data-testid='menu-item-1']").should("be.visible");

      cy.get(".MuiPaper-root").within(() => {
        cy.get("span").should("exist");
      });
    });
  });

  describe("Arrow Visibility", () => {
    it("shows arrow by default", () => {
      cy.mount(
        <TestWrapper>
          <MockPopoverComponent />
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").click();
      cy.get(".MuiPaper-root").within(() => {
        cy.get("span").should("exist");
      });
    });
  });

  describe("Custom Styling", () => {
    it("applies custom sx styles", () => {
      const customSx = {
        backgroundColor: "primary.main",
        color: "white",
        minWidth: 300,
      };

      cy.mount(
        <TestWrapper>
          <MockPopoverComponent customSx={customSx} />
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").click();
      cy.get(".MuiPaper-root").should("have.css", "min-width", "300px");
    });

    it("maintains default menu item styling", () => {
      cy.mount(
        <TestWrapper>
          <MockPopoverComponent />
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").click();
      cy.get("[data-testid='menu-item-1']").should("be.visible");

      cy.get("[data-testid='menu-item-1']").should(
        "have.css",
        "display",
        "flex"
      );
    });
  });

  describe("Controlled Usage", () => {
    it("works as a controlled component", () => {
      let buttonRef;

      const ControlledTest = () => {
        const [open, setOpen] = useState(false);
        const [anchorEl, setAnchorEl] = useState(null);

        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
          setOpen(true);
        };

        const handleClose = () => {
          setOpen(false);
          setAnchorEl(null);
        };

        return (
          <>
            <Button
              ref={(ref) => {
                buttonRef = ref;
              }}
              data-testid="controlled-trigger"
              onClick={handleClick}
            >
              Controlled Trigger
            </Button>
            <ControlledPopover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
            />
          </>
        );
      };

      cy.mount(
        <TestWrapper>
          <ControlledTest />
        </TestWrapper>
      );

      cy.get("[data-testid='controlled-trigger']").click();
      cy.contains("Popover Content").should("be.visible");
    });
  });

  describe("Positioning and Anchoring", () => {
    it("positions popover relative to anchor element", () => {
      cy.mount(
        <TestWrapper>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <MockPopoverComponent />
          </Box>
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").click();

      cy.get("[data-testid='trigger-button']").then(($button) => {
        const buttonRect = $button[0].getBoundingClientRect();

        cy.get(".MuiPaper-root")
          .should("be.visible")
          .then(($popover) => {
            const popoverRect = $popover[0].getBoundingClientRect();

            expect(popoverRect.top).to.be.greaterThan(buttonRect.bottom - 50);
          });
      });
    });

    it("handles different anchor origins correctly", () => {
      const positions = [
        "top-left",
        "bottom-right",
        "left-center",
        "right-center",
      ];

      positions.forEach((arrow) => {
        cy.mount(
          <TestWrapper>
            <MockPopoverComponent arrow={arrow} />
          </TestWrapper>
        );

        cy.get("[data-testid='trigger-button']").click();
        cy.get("[data-testid='menu-item-1']").should("be.visible");

        cy.get("body").click(0, 0);
        cy.get("[data-testid='menu-item-1']").should("not.exist");
      });
    });
  });

  describe("Accessibility", () => {
    it("handles keyboard navigation", () => {
      cy.mount(
        <TestWrapper>
          <MockPopoverComponent />
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").click();
      cy.get("[data-testid='menu-item-1']").should("be.visible");

      cy.get("body").type("{esc}");
      cy.get("[data-testid='menu-item-1']").should("not.exist");
    });

    it("maintains focus management", () => {
      cy.mount(
        <TestWrapper>
          <MockPopoverComponent />
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").click();
      cy.get("[data-testid='menu-item-1']").should("be.visible");

      cy.get("[data-testid='menu-item-1']").focus();
      cy.focused().should("have.attr", "data-testid", "menu-item-1");
    });
  });

  describe("Edge Cases", () => {
    it("handles null/undefined open prop gracefully", () => {
      cy.mount(
        <TestWrapper>
          <ControlledPopover open={null} anchorEl={null} />
        </TestWrapper>
      );

      cy.contains("Popover Content").should("not.exist");
    });

    it("handles missing anchorEl gracefully", () => {
      cy.mount(
        <TestWrapper>
          <ControlledPopover open={true} anchorEl={null} />
        </TestWrapper>
      );

      cy.get("[data-testid='controlled-popover']").should("exist");
    });

    it("handles invalid arrow position", () => {
      cy.mount(
        <TestWrapper>
          <MockPopoverComponent arrow="invalid-position" />
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").click();
      cy.get("[data-testid='menu-item-1']").should("be.visible");

      cy.get(".MuiPaper-root").within(() => {
        cy.get("span").should("exist");
      });
    });
  });

  describe("usePopover Hook", () => {
    it("provides correct open/close functionality", () => {
      const HookTest = () => {
        const popover = usePopover();

        return (
          <>
            <Button data-testid="hook-trigger" onClick={popover.onOpen}>
              Open via Hook
            </Button>
            <CustomPopover open={popover.open} onClose={popover.onClose}>
              <Box sx={{ p: 2 }}>
                <Typography data-testid="hook-content">Hook Content</Typography>
                <Button
                  data-testid="inside-close"
                  onClick={popover.onClose}
                  sx={{ mt: 1 }}
                >
                  Close from Inside
                </Button>
              </Box>
            </CustomPopover>
          </>
        );
      };

      cy.mount(
        <TestWrapper>
          <HookTest />
        </TestWrapper>
      );

      cy.get("[data-testid='hook-trigger']").click();
      cy.get("[data-testid='hook-content']").should("be.visible");

      cy.get("[data-testid='inside-close']").click();
      cy.get("[data-testid='hook-content']").should("not.exist");
    });

    it("allows manual control via setOpen", () => {
      const ManualControlTest = () => {
        const popover = usePopover();

        return (
          <>
            <Button
              data-testid="manual-open"
              onClick={() => popover.setOpen(document.body)}
            >
              Manual Open
            </Button>
            <CustomPopover open={popover.open} onClose={popover.onClose}>
              <Box sx={{ p: 2 }}>
                <Typography data-testid="manual-content">
                  Manual Content
                </Typography>
                <Button
                  data-testid="manuel-close"
                  onClick={popover.onClose}
                  sx={{ mt: 1 }}
                >
                  Close from Inside
                </Button>
              </Box>
            </CustomPopover>
          </>
        );
      };

      cy.mount(
        <TestWrapper>
          <ManualControlTest />
        </TestWrapper>
      );

      cy.get("[data-testid='manual-open']").click();
      cy.get("[data-testid='manual-content']").should("be.visible");

      cy.get("[data-testid='manuel-close']").click();
      cy.get("[data-testid='manual-content']").should("not.exist");
    });
  });

  describe("Performance", () => {
    it("renders multiple popovers efficiently", () => {
      const MultiplePopovers = () => (
        <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <MockPopoverComponent />
            </Box>
          ))}
        </Box>
      );

      cy.mount(
        <TestWrapper>
          <MultiplePopovers />
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").should("have.length", 3);

      cy.get("[data-testid='trigger-button']").first().click();
      cy.get("[data-testid='menu-item-1']").should("be.visible");

      cy.get("body").click(0, 0);
      cy.get("[data-testid='menu-item-1']").should("not.exist");

      cy.get("[data-testid='trigger-button']").eq(1).click();
      cy.get("[data-testid='menu-item-1']").should("be.visible");

      cy.get("body").click(0, 0);
      cy.get("[data-testid='menu-item-1']").should("not.exist");

      cy.get("[data-testid='trigger-button']").eq(2).click();
      cy.get("[data-testid='menu-item-1']").should("be.visible");

      cy.get("body").click(0, 0);
      cy.get("[data-testid='menu-item-1']").should("not.exist");
    });

    it("handles multiple popover instances without interference", () => {
      const IndependentPopovers = () => (
        <Box sx={{ display: "flex", gap: 4, justifyContent: "space-around" }}>
          <MockPopoverComponent />
          <MockPopoverComponent />
        </Box>
      );

      cy.mount(
        <TestWrapper>
          <IndependentPopovers />
        </TestWrapper>
      );

      cy.get("[data-testid='trigger-button']").should("have.length", 2);

      cy.get("[data-testid='trigger-button']").first().should("be.visible");
      cy.get("[data-testid='trigger-button']").last().should("be.visible");

      cy.get("[data-testid='trigger-button']").first().click();
      cy.get("[data-testid='menu-item-1']").should("have.length", 1);

      cy.get("body").click(0, 0);
      cy.get("[data-testid='menu-item-1']").should("not.exist");

      cy.get("[data-testid='trigger-button']").last().click();
      cy.get("[data-testid='menu-item-1']").should("have.length", 1);

      cy.get("body").click(0, 0);
      cy.get("[data-testid='menu-item-1']").should("not.exist");
    });
  });
});
