import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from "@mui/material";

import ListIcon from "@mui/icons-material/List";
import React from "react";

function SettingsMenuWigdet() {
  return (
    <Box
      sx={{
        borderWidth: "0.1rem",
        borderColor: "black",
        borderStyle: " none solid none none",
        height: "100vh",
        backgroundColor: "background.paper",
        borderRadius: "20px",
      }}
    >
      <MenuList>
        <MenuItem sx={{ height: "3.8rem", marginY: -1 }}>
          <ListItemIcon>
            <ListIcon></ListIcon>
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
      </MenuList>
    </Box>
  );
}

export default SettingsMenuWigdet;
