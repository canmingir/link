import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";
import config from "../../config";
import { useConfig } from "../context/ConfigContext";
import { useContext } from "../ContextProvider/ContextProvider";

import React, { useEffect, useState } from "react";

function Console() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSubmenuOpen, setSubmenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [state, dispatch] = useContext();
  const globalConfig = useConfig();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (isSubmenuOpen) {
      setSubmenuOpen(false);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleItemSelect = (item) => {
    dispatch({ type: "ITEM_SELECT", payload: item.id });
  };

  useEffect(() => {
    const foundItem = globalConfig.itemsData.find(
      (item) => item.id === state.itemId
    );

    if (foundItem) {
      setSelectedItem(foundItem);
    }
    selectedItem && setSubmenuOpen(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopNavBar
        sx={{ flexShrink: 0 }}
        anchorElUser={anchorElUser}
        handleOpenUserMenu={handleOpenUserMenu}
        handleCloseUserMenu={handleCloseUserMenu}
        routes={config.topMenu}
        itemsData={globalConfig.itemsData}
        onItemSelect={handleItemSelect}
        sideBarToggle={toggleCollapse}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        itemUrl="/"
        itemName="ITEEEEEM"
      />

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar
          sx={{ flexShrink: 0 }}
          routes={config.sideMenu}
          isCollapsed={isCollapsed}
        />

        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Console;
