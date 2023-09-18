import AddItemForm from "../../widgets/AddItemForm";
import AddItemWizard from "../../widgets/AddItemWizard/AddItemWizard";
import AddNewButton from "../../components/AddNewButton/AddNewButton";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { Grid } from "@mui/material";
import TeamCard from "../../components/TeamCard/TeamCard";
import TeamSkeleton from "../../components/Skeletons/TeamSkeleton";
import { useContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import useTeamsState from "../../hooks/useTeamsState";
import useUIState from "../../hooks/useUIState";

import React, { useCallback, useEffect, useState } from "react";

function TeamsWidget() {
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [, dispatch] = useContext();
  const {
    teamState,
    fetchTeams,
    editTeam,
    addTeamAndColleague,
    deleteTeam,
    setTeamForEditing,
  } = useTeamsState();

  const {
    uiState,
    openForm,
    closeForm,
    openWizard,
    closeWizard,
    openDialog,
    closeDialog,
  } = useUIState();

  const fetchData = useCallback(async () => {
    await fetchTeams();
    setLoading(false);
  }, [fetchTeams]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  const handleTeamClick = (team) => {
    navigate(`/teams/colleagues`);
    dispatch({ type: "TEAM_SELECT", payload: team });
  };
  const handleColleagueClick = (colleagueid) => {
    navigate(`/colleagues/${colleagueid}`);
  };
  return (
    <>
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <AddNewButton
          type="largeButton"
          addNew="Teams"
          onClickFunction={() => openWizard()}
        />
      </Grid>
      {loading
        ? Array.from({ length: 5 }).map((_, index) => (
            <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
              <TeamSkeleton key={index} />
            </Grid>
          ))
        : teamState.teamsData.map((team, i) => (
            <Grid item xs={12} sm={12} md={6} lg={4} key={team.id}>
              <TeamCard
                team={{ ...team, members: teamState.teamsMembers[i] }}
                onTeamClick={() => handleTeamClick(team.id)}
                onColleagueClick={(colleagueid) =>
                  handleColleagueClick(colleagueid)
                }
                onDelete={() => {
                  setDeleteFunction(() => () => deleteTeam(team.id));
                  openDialog();
                }}
                onEdit={() => {
                  openForm();
                  setTeamForEditing(team);
                }}
              />
            </Grid>
          ))}
      <AddItemWizard
        title="team and colleague"
        itemProperties={[
          { title: "Team", fields: ["name", "icon"] },
          { title: "Colleague", fields: ["name", "email", "phone"] },
        ]}
        onSubmit={addTeamAndColleague}
        open={uiState.wizardOpen}
        onClose={closeWizard}
      />
      <AddItemForm
        title="team"
        itemProperties={["name", "icon"]}
        onSubmit={editTeam}
        open={uiState.formOpen}
        onClose={closeForm}
        itemToEdit={teamState.teamToEdit}
      />
      <ConfirmationDialog
        open={uiState.dialogOpen}
        onClose={closeDialog}
        onConfirm={() => {
          deleteFunction();
          closeDialog();
        }}
        sx={{ borderRadius: "25px" }}
        title="Confirm deletion"
        content="Are you sure you want to delete this team?"
      />
    </>
  );
}

export default TeamsWidget;
