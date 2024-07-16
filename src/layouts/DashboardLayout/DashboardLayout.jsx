import Box from "@mui/material/Box";
import Header from "./header";
import Main from "./main";
import NavHorizontal from "./nav-horizontal";
import NavMini from "./nav-mini";
import NavVertical from "./nav-vertical";
import { Outlet } from "react-router";
import React from "react";
import { useBoolean } from "../../hooks/use-boolean";
import { useResponsive } from "../../hooks/use-responsive";
import { useSettingsContext } from "../../components/settings";

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const settings = useSettingsContext();

  const lgUp = useResponsive("up", "lg");

  const nav = useBoolean();
  const isHorizontal = settings.themeLayout === "horizontal";

  const isMini = settings.themeLayout === "mini";

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = (
    <>
      <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />
    </>
  );
  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>
          <Outlet />
        </Main>
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>
            <Outlet />
          </Main>
        </Box>
      </>
    );
  }
  return (
    <>
      <Header onOpenNav={nav.onTrue} />

      <Box
        sx={{
          minHeight: 1,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {renderNavVertical}
        <Main>
          <Outlet />
        </Main>
      </Box>
    </>
  );
}
