import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const mockConfig = {
  template: {
    login: {
      largeIcon: "/assets/logo/logo_single.svg",
    },
  },
};

const mockStyles = {
  appBar: { zIndex: 1201 },
  toolBar: { pr: 2, pl: 4, color: "primary.contrastText" },
  imgBox: { height: "20px", marginX: "15px" },
};

const mockItemsData = [
  { id: 1, name: "Project Alpha" },
  { id: 2, name: "Project Beta" },
  { id: 3, name: "Project Gamma" },
];

const mockRoutes = [
  { name: "Dashboard", url: "/dashboard", hide: false },
  { name: "Analytics", url: "/analytics", hide: false },
  { name: "Hidden Route", url: "/hidden", hide: true },
];

const mockUserData = {
  name: "John Doe",
  avatar_url: "/avatar.jpg",
  picture: "/fallback-avatar.jpg",
};

const MockTopNavBar = ({
  config = mockConfig,
  styles = mockStyles,
  itemsData = mockItemsData,
  routes = mockRoutes,
  userData = mockUserData,
  selectedItem = null,
  itemName = "Project",
  itemUrl = "/project",
  anchorElUser = null,
  handleOpenUserMenu = () => {},
  handleCloseUserMenu = () => {},
  onItemSelect = () => {},
  sideBarToggle = () => {},
  setSelectedItem = () => {},
}) => {
  const [anchorElItem, setAnchorElItem] = React.useState(null);
  const { largeIcon } = config.template.login;

  const handleOpenItemMenu = (event) => {
    setAnchorElItem(event.currentTarget);
  };

  const handleCloseItemMenu = () => {
    setAnchorElItem(null);
  };

  const selectItem = (item) => {
    setSelectedItem(item);
    onItemSelect(item);
    handleCloseItemMenu();
  };

  const settings = [
    {
      name: "Profile",
      action: () => {
        handleCloseUserMenu();
      },
    },
    {
      name: "Logout",
      action: () => {
        handleCloseUserMenu();
      },
    },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{ ...styles.appBar, maxHeight: "4.25rem" }}
      data-testid="topnavbar"
    >
      <Toolbar disableGutters sx={styles.toolBar}>
        <Box
          component="img"
          src={largeIcon}
          data-testid="logo"
          sx={{ cursor: "pointer" }}
        />
        {selectedItem && (
          <Box>
            <IconButton
              size="large"
              onClick={sideBarToggle}
              color="inherit"
              data-testid="menu-button"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            flexGrow: 0,
            pl: 2,
          }}
        >
          <Button
            onClick={handleOpenItemMenu}
            sx={{ my: 2, color: "primary.contrastText" }}
            data-testid="item-button"
          >
            {selectedItem ? selectedItem.name : `Select a ${itemName}`}
            <ArrowDropDownIcon />
          </Button>
          <Menu
            id="item-menu"
            anchorEl={anchorElItem}
            keepMounted
            open={Boolean(anchorElItem)}
            onClose={handleCloseItemMenu}
            sx={{ my: 2, color: "primary.contrastText" }}
            data-testid="item-menu"
          >
            {itemsData?.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => selectItem(item)}
                data-testid={`item-${item.id}`}
              >
                <Typography textAlign="center">{item.name}</Typography>
              </MenuItem>
            ))}
          </Menu>

          {routes
            .filter((route) => !route.hide)
            .map((page, index) => (
              <Button
                key={index}
                href={page.url}
                sx={{ my: 2, color: "primary.contrastText" }}
                data-testid={`route-${page.name}`}
              >
                {page.name}
              </Button>
            ))}
        </Box>
        <Box sx={{ position: "absolute", right: 30 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                sx={{ width: "2.2rem", height: "auto" }}
                data-testid="user-avatar"
                src={userData?.avatar_url || userData?.picture}
              />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            data-testid="user-menu"
          >
            <Typography
              sx={{
                margin: "0.5rem",
              }}
              data-testid="user-name"
            >
              {userData?.name}
            </Typography>
            {settings.map((setting) => (
              <MenuItem
                key={setting.name}
                onClick={setting.action}
                data-testid={`setting-${setting.name}`}
              >
                <Typography textAlign="center">{setting.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
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

describe("TopNavBar Component", () => {
  it("renders the TopNavBar component", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar />
      </TestWrapper>
    );

    cy.get("[data-testid='topnavbar']").should("exist");
    cy.get("header").should("exist");
    cy.get(".MuiToolbar-root").should("exist");
    cy.get("[data-testid='logo']").should("exist");
    cy.get("[data-testid='item-button']").should("exist");
    cy.get("[data-testid='user-avatar']").should("exist");
  });

  it("displays the logo from config", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar />
      </TestWrapper>
    );

    cy.get("[data-testid='logo']").should("exist");
    cy.get("[data-testid='logo']").should(
      "have.attr",
      "src",
      "/assets/logo/logo_single.svg"
    );
  });

  it("shows menu button when selectedItem exists", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar selectedItem={mockItemsData[0]} />
      </TestWrapper>
    );

    cy.get("[data-testid='menu-button']").should("exist");
    cy.get("[data-testid='MenuIcon']").should("exist");
    cy.get("[data-testid='item-button']").should("contain", "Project Alpha");
  });

  it("hides menu button when no selectedItem", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar />
      </TestWrapper>
    );

    cy.get("[data-testid='menu-button']").should("not.exist");
    cy.get("[data-testid='MenuIcon']").should("not.exist");
  });

  it("displays item selection button with correct text", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar />
      </TestWrapper>
    );

    cy.get("[data-testid='item-button']").should("contain", "Select a Project");
  });

  it("opens item menu when item button is clicked", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar />
      </TestWrapper>
    );

    cy.get("[data-testid='item-button']").click();
    cy.get("[data-testid='item-menu']").should("exist");
    cy.get("#item-menu").should("exist");

    mockItemsData.forEach((item) => {
      cy.get(`[data-testid='item-${item.id}']`).should("contain", item.name);
    });
  });

  it("selects item when menu item is clicked", () => {
    const onItemSelect = cy.stub();
    const setSelectedItem = cy.stub();

    cy.mount(
      <TestWrapper>
        <MockTopNavBar
          onItemSelect={onItemSelect}
          setSelectedItem={setSelectedItem}
        />
      </TestWrapper>
    );

    cy.get("[data-testid='item-button']").click();
    cy.get("[data-testid='item-1']").click();

    cy.then(() => {
      expect(onItemSelect).to.have.been.called;
      expect(setSelectedItem).to.have.been.called;
    });
  });

  it("displays navigation routes as links", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar />
      </TestWrapper>
    );

    cy.get("[data-testid='route-Dashboard']").should("exist");
    cy.get("[data-testid='route-Analytics']").should("exist");

    cy.get("[data-testid='route-Hidden Route']").should("not.exist");
  });

  it("displays user avatar with correct source", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar />
      </TestWrapper>
    );

    cy.get("[data-testid='user-avatar']").should("exist");
    cy.get("[data-testid='user-avatar'] img").should(
      "have.attr",
      "src",
      "/avatar.jpg"
    );
  });

  it("falls back to picture when avatar_url is not available", () => {
    const userDataWithPicture = {
      ...mockUserData,
      avatar_url: null,
    };

    cy.mount(
      <TestWrapper>
        <MockTopNavBar userData={userDataWithPicture} />
      </TestWrapper>
    );

    cy.get("[data-testid='user-avatar'] img").should(
      "have.attr",
      "src",
      "/fallback-avatar.jpg"
    );
  });

  it("opens user menu when avatar is clicked", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar anchorElUser={document.createElement("div")} />
      </TestWrapper>
    );

    cy.get("[data-testid='user-menu']").should("exist");
    cy.get("#menu-appbar").should("exist");
  });

  it("displays user name in user menu", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar anchorElUser={document.createElement("div")} />
      </TestWrapper>
    );

    cy.get("[data-testid='user-name']").should("contain", "John Doe");
  });

  it("displays Profile and Logout options in user menu", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar anchorElUser={document.createElement("div")} />
      </TestWrapper>
    );

    cy.get("[data-testid='setting-Profile']").should("exist");
    cy.get("[data-testid='setting-Logout']").should("exist");
  });

  it("calls handleCloseUserMenu when Profile is clicked", () => {
    const handleCloseUserMenu = cy.stub();

    cy.mount(
      <TestWrapper>
        <MockTopNavBar
          anchorElUser={document.createElement("div")}
          handleCloseUserMenu={handleCloseUserMenu}
        />
      </TestWrapper>
    );

    cy.get("[data-testid='setting-Profile']").click();

    cy.then(() => {
      expect(handleCloseUserMenu).to.have.been.called;
    });
  });

  it("calls sideBarToggle when menu button is clicked", () => {
    const sideBarToggle = cy.stub();

    cy.mount(
      <TestWrapper>
        <MockTopNavBar
          selectedItem={mockItemsData[0]}
          sideBarToggle={sideBarToggle}
        />
      </TestWrapper>
    );

    cy.get("[data-testid='menu-button']").click();

    cy.then(() => {
      expect(sideBarToggle).to.have.been.called;
    });
  });

  it("accepts different config sources", () => {
    const customConfig = {
      template: {
        login: {
          largeIcon: "/custom-logo.svg",
        },
      },
    };

    cy.mount(
      <TestWrapper>
        <MockTopNavBar config={customConfig} />
      </TestWrapper>
    );

    cy.get("[data-testid='logo']").should(
      "have.attr",
      "src",
      "/custom-logo.svg"
    );
  });

  it("applies custom styles when provided", () => {
    const customStyles = {
      appBar: { zIndex: 1300 },
      toolBar: { pr: 4, pl: 8, color: "secondary.contrastText" },
    };

    cy.mount(
      <TestWrapper>
        <MockTopNavBar styles={customStyles} />
      </TestWrapper>
    );

    cy.get("[data-testid='topnavbar']").should("exist");
  });

  it("handles empty itemsData array", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar itemsData={[]} />
      </TestWrapper>
    );

    cy.get("[data-testid='item-button']").click();
    cy.get("[data-testid='item-menu']").should("exist");
    cy.get("#item-menu").should("exist");
    cy.get("#item-menu .MuiMenuItem-root").should("have.length", 0);
  });

  it("handles empty routes array", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar routes={[]} />
      </TestWrapper>
    );

    cy.get("[data-testid='topnavbar']").should("exist");
    cy.get("a[data-testid*='route-']").should("have.length", 0);
  });

  it("handles missing userData gracefully", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar userData={null} />
      </TestWrapper>
    );

    cy.get("[data-testid='user-avatar']").should("exist");

    cy.get("[data-testid='user-avatar']").should("be.visible");
  });

  it("handles missing config gracefully", () => {
    const emptyConfig = {
      template: {
        login: {},
      },
    };

    cy.mount(
      <TestWrapper>
        <MockTopNavBar config={emptyConfig} />
      </TestWrapper>
    );

    cy.get("[data-testid='topnavbar']").should("exist");
    cy.get("[data-testid='logo']").should("exist");
  });

  it("maintains responsive design", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar />
      </TestWrapper>
    );

    cy.viewport(320, 568);
    cy.get("[data-testid='topnavbar']").should("be.visible");
    cy.get("[data-testid='user-avatar']").should("be.visible");

    cy.viewport(768, 1024);
    cy.get("[data-testid='topnavbar']").should("be.visible");
    cy.get("[data-testid='item-button']").should("be.visible");

    cy.viewport(1920, 1080);
    cy.get("[data-testid='topnavbar']").should("be.visible");
    cy.get("[data-testid='route-Dashboard']").should("be.visible");
  });

  it("handles long item names gracefully", () => {
    const longNameItems = [
      {
        id: 1,
        name: "Very Long Project Name That Might Overflow The Button Area",
      },
      { id: 2, name: "Another Extremely Long Project Name For Testing" },
    ];

    cy.mount(
      <TestWrapper>
        <MockTopNavBar
          itemsData={longNameItems}
          selectedItem={longNameItems[0]}
        />
      </TestWrapper>
    );

    cy.get("[data-testid='item-button']").should(
      "contain",
      "Very Long Project Name"
    );
    cy.get("[data-testid='topnavbar']").should("exist");
  });

  it("handles different item names correctly", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar itemName="Task" />
      </TestWrapper>
    );

    cy.get("[data-testid='item-button']").should("contain", "Select a Task");
  });

  it("applies correct Material-UI styling", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar />
      </TestWrapper>
    );

    cy.get("header").should("have.css", "position", "sticky");
    cy.get("header").should("have.css", "z-index", "1201");

    cy.get(".MuiToolbar-root").should("exist");

    cy.get("[data-testid='item-button']").should(
      "have.class",
      "MuiButton-root"
    );

    cy.get("[data-testid='user-avatar']").should(
      "have.class",
      "MuiAvatar-root"
    );
  });

  it("has proper tooltip on user avatar", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar />
      </TestWrapper>
    );

    cy.get("[data-testid='user-avatar']").parent().trigger("mouseover");

    cy.get(".MuiTooltip-tooltip").should("contain", "Open settings");
  });

  it("displays ArrowDropDown icon in item button", () => {
    cy.mount(
      <TestWrapper>
        <MockTopNavBar />
      </TestWrapper>
    );

    cy.get("[data-testid='item-button']").within(() => {
      cy.get("[data-testid='ArrowDropDownIcon']").should("exist");
    });
  });
});
