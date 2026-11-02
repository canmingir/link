import Box from "@mui/material/Box";
import Header from "./header";
import { Outlet } from "react-router";
import React from "react";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: 1 }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, md: 10 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
