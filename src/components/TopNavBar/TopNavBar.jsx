import GrayCollarLogo from "./GrayCollarLogo.png";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { Person } from "@mui/icons-material";
import React from "react";
import styles from "./styles";
import { useContext } from "../../ContextProvider/ContextProvider";
import { useNavigate } from "react-router";

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

function TopNavBar({
  anchorElUser,
  handleOpenUserMenu,
  handleCloseUserMenu,
  routes,
  sideBarToggle,
}) {
  const navigate = useNavigate();

  const [, dispatch] = useContext();
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
        dispatch({ type: "LOGOUT" });
        handleCloseUserMenu();
        navigate(0);
      },
    },
  ];

  return (
    <AppBar position="sticky" sx={styles.appBar}>
      <Toolbar disableGutters sx={styles.toolBar}>
        <Box
          component="img"
          src={GrayCollarLogo}
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        />

        <Box>
          <IconButton size="large" onClick={sideBarToggle} color="inherit">
            <MenuIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flexGrow: 0,
            pl: 2,
          }}
        >
          {routes
            .filter((route) => !route.hide)
            .map((page, index) => (
              <Button
                key={index}
                component={Link}
                to={page.url}
                sx={{ my: 2, color: "primary.contrastText" }}
              >
                {page.name}
              </Button>
            ))}
        </Box>
        <Box sx={{ position: "absolute", right: 30 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ backgroundColor: "background.default" }}>
                <Person color="primary" />
              </Avatar>
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
          >
            {settings.map((setting) => (
              <MenuItem key={setting.name} onClick={setting.action}>
                <Typography textAlign="center">{setting.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopNavBar;
