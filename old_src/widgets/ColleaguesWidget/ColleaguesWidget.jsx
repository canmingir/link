import AddItemForm from "../AddItemForm/AddItemForm";
import AddNewButton from "../../components/AddNewButton";
import ColleagueCard from "../../components/ColleagueCard";
import ColleagueSkeleton from "../../components/Skeletons/ColleagueSkeleton";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import { Grid } from "@mui/material";
import useColleagueState from "../../hooks/useColleagueState";
import { useContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import useTeamsState from "../../hooks/useTeamsState";
import useUIState from "../../hooks/useUIState";

import React, { useCallback, useEffect, useState } from "react";

function ColleaguesWidget({ teamId }) {
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { uiState, openForm, closeForm, openDialog, closeDialog } =
    useUIState();
  const [, dispatch] = useContext();

  const {
    colleagueState,
    editColleague,
    addColleague,
    deleteColleague,
    setColleagueForEditing,
    fetchColleagues,
  } = useColleagueState(teamId);

  const { deleteTeam } = useTeamsState();
  const handleColleagueClick = (colleagueid) => {
    navigate(`/colleagues/${colleagueid}`);
  };

  function deleteTeams() {
    dispatch({ type: "TEAM_DELETE" });
    navigate("/teams");
  }

  const fetchData = useCallback(async () => {
    await fetchColleagues(teamId);
    setLoading(false);
  }, [fetchColleagues, teamId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  return (
    <>
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <AddNewButton
          type={"wideButton"}
          addNew={"Colleague"}
          onClickFunction={() => openForm()}
        />
      </Grid>
      {loading
        ? Array.from({ length: 5 }).map((_, index) => (
            <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
              <ColleagueSkeleton key={index} />
            </Grid>
          ))
        : colleagueState.colleaguesData.map((colleague) => (
            <Grid item xs={12} sm={12} md={6} lg={4} key={colleague.id}>
              <ColleagueCard
                colleague={colleague}
                onColleagueClick={() => handleColleagueClick(colleague.id)}
                fontSize="xx-large"
                onDelete={() => {
                  setDeleteFunction(() => () => deleteColleague(colleague.id));
                  openDialog();
                }}
                topBar={false}
                onEdit={() => {
                  setColleagueForEditing(colleague);
                  openForm();
                }}
                isLastColleague={colleagueState.colleaguesData.length === 1}
              />
            </Grid>
          ))}
      <Grid container justifyContent="center" mt={5} spacing={2}>
        <AddItemForm
          title="colleague"
          itemProperties={["name", "email", "phone"]}
          onSubmit={
            colleagueState.colleagueToEdit ? editColleague : addColleague
          }
          open={uiState.formOpen}
          onClose={() => {
            closeForm();
            setColleagueForEditing(null);
          }}
          itemToEdit={colleagueState.colleagueToEdit}
        />
        <ConfirmationDialog
          open={uiState.dialogOpen}
          onClose={closeDialog}
          onConfirm={() => {
            deleteFunction();
            closeDialog();
          }}
          title="Delete Confirmation"
          content="Are you sure you want to delete this item?"
        />
        <DeleteButton
          onClickFunction={() => (
            setDeleteFunction(() => async () => {
              await deleteTeam(teamId);
              deleteTeams();
            }),
            openDialog()
          )}
        />
      </Grid>
    </>
  );
}

export default ColleaguesWidget;
