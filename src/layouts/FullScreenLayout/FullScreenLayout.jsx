import Box from "@mui/material/Box";
import NavHorizontal from "./nav-horizontal";
import NavMini from "../DashboardLayout/nav-mini";
import NavVertical from "./nav-vertical";
import { Outlet } from "react-router";
import Stack from "@mui/material/Stack";
import config from "../../config/config";
import { useEvent } from "@nucleoidai/react-event";
import { useResponsive } from "../../hooks/use-responsive";

import React, { useEffect, useState } from "react";

// ----------------------------------------------------------------------

export default function FullScreenLayout() {
  const { fullScreenLayout } = config().menu;

  const renderNavMini = <NavMini only={true} />;
  const renderHorizontal = <NavHorizontal />;

  const lgUp = useResponsive("up", "lg");

  const [nav, setNav] = useState(false);

  const [openNav] = useEvent("PLATFORM_NAV_OPENED", { layout: null });
  const [closeNav] = useEvent("PLATFORM_NAV_CLOSED", { layout: null });

  console.log(openNav, closeNav);

  useEffect(() => {
    if (openNav.layout === "fullScreen") {
      setNav(true);
    }
  }, [openNav]);

  useEffect(() => {
    if (closeNav.layout === "fullScreen") {
      setNav(false);
    }
  }, [closeNav]);

  const renderNavVertical = (
    <NavVertical openNav={nav} onCloseNav={() => setNav(false)} />
  );

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
        {lgUp ? (
          render()
        ) : (
          <>
            {renderNavVertical}
            <Outlet />
          </>
        )}
      </Box>
    </>
  );
}
