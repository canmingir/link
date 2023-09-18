import { Box } from "@mui/material";
import ColleagueCard from "../../components/ColleagueCard";
import ColleagueSkeleton from "../../components/Skeletons/ColleagueSkeleton";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import React from "react";
import styles from "./styles";
import useColleagueState from "../../hooks/useColleagueState";
import { useNavigate } from "react-router-dom";
import useUIState from "../../hooks/useUIState";

import { useCallback, useEffect, useState } from "react";

function ColleagueWidget({ colleagueId }) {
  const [loading, setLoading] = useState(true);
  const { uiState, openDialog, closeDialog } = useUIState();
  const { colleagueState, deleteColleague, getColleagueById } =
    useColleagueState();

  const navigate = useNavigate();

  const handleDelete = async (id) => {
    await deleteColleague(id);
    navigate(`/teams/colleagues`);
  };
  const fetchColleague = useCallback(async () => {
    await getColleagueById(colleagueId);
    setLoading(false);
  }, [getColleagueById, colleagueId]);

  useEffect(() => {
    fetchColleague();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {colleagueState.colleagueToEdit && (
        <Box sx={styles.colleagueBox}>
          {loading ? (
            <ColleagueSkeleton />
          ) : (
            <ColleagueCard
              colleague={colleagueState?.colleagueToEdit}
              fontSize="xx-large"
              topBar={true}
              sx={{
                padding: "20px",
              }}
              showBackstory={true}
              responsive={true}
            />
          )}
        </Box>
      )}
      <ConfirmationDialog
        open={uiState.dialogOpen}
        onClose={closeDialog}
        onConfirm={() => {
          handleDelete(colleagueState.colleagueToEdit.id);
          closeDialog();
        }}
        title="Delete Colleague"
        content="Are you sure you want to delete this colleague?"
      />
      <DeleteButton oncClickFunction={() => openDialog()} />
    </>
  );
}

export default ColleagueWidget;
