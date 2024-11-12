import { Grid } from "@mui/material";
import React from "react";
import SettingsMenuWigdet from "../widgets/SettingsMenuWidget";
import TeamPermissionWidget from "../widgets/TeamPermissionWidget";

const settings = () => {
  return (
    <Grid container sx={{ alignSelf: "center", justifySelf: "center" }}>
      <Grid item xs={4}>
        <SettingsMenuWigdet />
      </Grid>
      <Grid item xs={8}>
        <TeamPermissionWidget />
      </Grid>
    </Grid>
  );
};

export default settings;
