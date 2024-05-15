import BoltIcon from "@mui/icons-material/Bolt";
import { IconButton } from "@mui/material";

const EnergyButton = () => (
  <IconButton
    sx={{
      width: "3rem",
      height: "3rem",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: (theme) => theme.palette.primary,
    }}
  >
    <BoltIcon sx={{ width: "100%", height: "100%" }} color="primary" />
  </IconButton>
);

export default EnergyButton;
