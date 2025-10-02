import { Box } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import styles from "./styles";

const Sidebar = ({ routes, isCollapsed, currentPage }) => {
  const drawerWidth = isCollapsed ? 75 : 280;

  return (
    <>
      <Box
        sx={{
          top: 0,
          left: 0,
          height: "4rem",
          width: 75,
          position: "absolute",
          marginRight: -10.2,
        }}
      ></Box>
      <Drawer
        anchor="left"
        variant="persistent"
        open={true}
        data-testid="sidebar"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            ...styles.paper,
            width: drawerWidth,
            transition: ".5s ease",
          },
        }}
      >
        <List sx={styles.list}>
          {routes.map((page, index) => (
            <div key={index}>
              <Link to={page.url} style={{ textDecoration: "none" }}>
                <ListItemButton sx={styles.listItemButton}>
                  <Box
                    sx={{
                      ...styles.box,
                      flexDirection: isCollapsed ? "column" : "row",
                      alignItems: isCollapsed ? "center" : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        mb: isCollapsed ? 0 : 0,
                        mr: isCollapsed ? 0 : 3,
                      }}
                    >
                      {page.url === currentPage ? (
                        <page.activeIcon />
                      ) : (
                        <page.deactiveIcon />
                      )}
                    </Box>

                    {!isCollapsed && <ListItemText primary={page.name} />}
                  </Box>
                </ListItemButton>
              </Link>
            </div>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
