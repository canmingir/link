import { Link } from "react-router-dom";
import React from "react";
import { storage } from "@nucleoidjs/webstorage";
import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material/";

export default function TopNavigation({ items = [] }) {
  const handleLogout = () => {
    storage.remove("accessToken");
    storage.remove("refreshToken");
    window.location.href = "/login";
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              Nuc
            </IconButton>
            {items.map((item, index) => (
              <Button
                color="inherit"
                component={Link}
                to={item.url}
                key={index}
              >
                {item.name}
              </Button>
            ))}
          </Box>
          <Box>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
