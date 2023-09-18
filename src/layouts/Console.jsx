import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";
import config from "../../config";
import { useContext } from "../context/ContextProvider";
import useTeamsState from "../hooks/useTeamsState";

import React, { useEffect, useState } from "react";

function Console() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { teamState, fetchTeamsData } = useTeamsState();
  const [isSubmenuOpen, setSubmenuOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState();
  const [state, dispatch] = useContext();
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

  const handleTeamSelect = (team) => {
    dispatch({ type: "TEAM_SELECT", payload: team.id });
  };

  useEffect(() => {
    const foundTeam = teamState?.teamsData.find(
      (team) => team.id === state.teamId
    );

    if (foundTeam) {
      setSelectedTeam(foundTeam);
    }
    selectedTeam && setSubmenuOpen(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamState.teamsData]);

  useEffect(() => {
    fetchTeamsData();
  }, [fetchTeamsData, state.teamId]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopNavBar
        sx={{ flexShrink: 0 }}
        anchorElUser={anchorElUser}
        handleOpenUserMenu={handleOpenUserMenu}
        handleCloseUserMenu={handleCloseUserMenu}
        routes={config.topMenu}
        teamState={teamState}
        onTeamSelect={handleTeamSelect}
        sideBarToggle={toggleCollapse}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
      />

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {state.teamId ? (
          <Sidebar
            sx={{ flexShrink: 0 }}
            routes={config.sideMenu}
            isCollapsed={isCollapsed}
          />
        ) : null}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Console;
