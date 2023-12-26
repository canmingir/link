import Box from "@mui/material/Box";
import NavHorizontal from "./nav-horizontal";
import NavMini from "../DashboardLayout/nav-mini";
import { Outlet } from "react-router";
import React from "react";
import Stack from "@mui/material/Stack";
import { useConfig } from "../../context/ConfigContext";

// ----------------------------------------------------------------------

export default function FullScreenLayout() {
  const { fullScreenLayout } = useConfig();

  const renderNavMini = <NavMini only={true} />;
  const renderHorizontal = <NavHorizontal />;

  const render = () => {
    switch (fullScreenLayout) {
      case "right":
        return (
          <>
            <Outlet />
            {renderNavMini}
          </>
        );
      case "left":
        return (
          <>
            {renderNavMini}

            <Outlet />
          </>
        );
      case "top":
        return (
          <>
            {renderHorizontal}
            <Stack width={"100%"} sx={{ mt: 7 }}>
              <Outlet />
            </Stack>
          </>
        );
      default:
        return (
          <>
            {renderNavMini}
            <Outlet />
          </>
        );
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: 1,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {render()}
      </Box>
    </>
  );
}
