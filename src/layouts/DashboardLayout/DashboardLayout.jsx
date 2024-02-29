import Box from "@mui/material/Box";
import Header from "./header";
import Main from "./main";
import NavHorizontal from "./nav-horizontal";
import NavMini from "./nav-mini";
import NavVertical from "./nav-vertical";
import { Outlet } from "react-router";
import PropTypes from "prop-types";
import React from "react";
import config from "../../../../../config.js";
import { useBoolean } from "../../hooks/use-boolean";
import { useContext } from "../../ContextProvider/ContextProvider";
import { useResponsive } from "../../hooks/use-responsive";
import { useSettingsContext } from "../../components/settings";
// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [state, dispatch] = useContext();
  const [selectedItem, setSelectedItem] = React.useState();

  React.useEffect(() => {
    const foundItem = config.itemsData.find((item) => item.id === state.itemId);

    if (foundItem) {
      setSelectedItem(foundItem);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.itemId]);
  const handleItemSelect = (item) => {
    dispatch({ type: "ITEM_SELECT", payload: item.id });
  };

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
        <Header
          onOpenNav={nav.onTrue}
          handleItemSelect={handleItemSelect}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />

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
        <Header
          onOpenNav={nav.onTrue}
          handleItemSelect={handleItemSelect}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />

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
      <Header
        onOpenNav={nav.onTrue}
        handleItemSelect={handleItemSelect}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />

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

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
