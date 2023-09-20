import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { Person } from "@mui/icons-material";
import React from "react";
import styles from "./styles";
import { useConfig } from "../../context/ConfigContext";
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
  itemsData,
  onItemSelect,
  routes,
  sideBarToggle,
  selectedItem,
  setSelectedItem,
  itemUrl,
  itemName,
}) {
  const [anchorElItem, setAnchorElItem] = React.useState(null);
  const globalConfig = useConfig();
  const handleOpenItemMenu = (event) => {
    setAnchorElItem(event.currentTarget);
  };

  const handleCloseItemMenu = () => {
    setAnchorElItem(null);
  };
  const navigate = useNavigate();

  const selectItem = (item) => {
    dispatch({ type: "ITEM_SELECT", payload: item.id });
    setSelectedItem(item);
    onItemSelect(item);
    handleCloseItemMenu();
  };

  const [state, dispatch] = useContext();
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

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.itemId]);

  return (
    <AppBar position="sticky" sx={styles.appBar}>
      <Toolbar disableGutters sx={styles.toolBar}>
        <Box
          component="img"
          src={globalConfig.login.largeIcon}
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        />
        {selectedItem && (
          <Box>
            <IconButton size="large" onClick={sideBarToggle} color="inherit">
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
          >
            {state.itemId ? selectedItem?.name : `Select a ${itemName}`}
            <ArrowDropDownIcon />
          </Button>
          <Menu
            id="item-menu"
            anchorEl={anchorElItem}
            keepMounted
            open={Boolean(anchorElItem)}
            onClose={handleCloseItemMenu}
            sx={{ my: 2, color: "primary.contrastText" }}
          >
            {itemsData?.map((item) => (
              <MenuItem
                key={item.id}
                component={Link}
                to={itemUrl}
                onClick={() => selectItem(item)}
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
