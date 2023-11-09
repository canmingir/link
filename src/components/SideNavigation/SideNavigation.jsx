import { Link } from "react-router-dom";
import React from "react";

import { Drawer, List, ListItem, ListItemText } from "@mui/material";

export default function SideNavigation({ items = [] }) {
  return (
    <Drawer
      variant="permanent"
      open={true}
      sx={{
        width: 250,
        flexShrink: 0,
        top: 64,
        "& .MuiDrawer-paper": {
          width: 250,
          boxSizing: "border-box",
          backgroundColor: "#111",
          position: "fixed",
          top: 64,
          height: "100%",
          transition: "width 0.3s",
        },
      }}
    >
      <List>
        {items.map((item) => (
          <ListItem
            key={item.name}
            component={Link}
            to={item.url}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
