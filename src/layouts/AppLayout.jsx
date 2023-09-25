import { Box } from "@mui/material";
import MiniTopBar from "../components/MiniTopBar";
import Sidebar from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";
import { useConfig } from "../context/ConfigContext";
import { useContext } from "../ContextProvider/ContextProvider";
import { useLocation } from "react-router-dom";
import user from "../http/user";

import React, { useEffect, useState } from "react";

function AppLayout({ children }) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSubmenuOpen, setSubmenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [state, dispatch] = useContext();
  const [miniTopMenu, setMiniTopMenu] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const location = useLocation();
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

  useEffect(() => {
    user.get("https://api.github.com/user").then((response) => {
      setUserAvatar(response.data.avatar_url);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.login]);

  useEffect(() => {
    const targetPage = globalConfig.topMenu.find(
      (target) => target.url === location.pathname
    );

    targetPage?.hideTopBar
      ? (setMiniTopMenu(true), setIsCollapsed(true))
      : (setMiniTopMenu(false), setIsCollapsed(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <Box>
      {state.login &&
        (miniTopMenu ? (
          <MiniTopBar />
        ) : (
          <TopNavBar
            sx={{ flexShrink: 0 }}
            anchorElUser={anchorElUser}
            handleOpenUserMenu={handleOpenUserMenu}
            handleCloseUserMenu={handleCloseUserMenu}
            routes={globalConfig.topMenu}
            itemsData={globalConfig.itemsData}
            onItemSelect={handleItemSelect}
            sideBarToggle={toggleCollapse}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            itemUrl="/"
            itemName="ITEEEEEM"
            userAvatar={userAvatar}
          />
        ))}

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {state.itemId ? (
          <Sidebar
            sx={{ flexShrink: 0 }}
            routes={globalConfig.sideMenu}
            isCollapsed={isCollapsed}
            currentPage={location.pathname}
          />
        ) : null}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
