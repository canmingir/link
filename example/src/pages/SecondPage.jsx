import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import config from "../../config";

export default function SecondPage() {
  return (
    <Stack
      spacing={1}
      alignItems="center"
      sx={{
        border: "solid 0.5rem gray",
        width: "100%",
        height: "100vh",
        backgroundColor: "gray",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Typography>
          Page created according to Atomic Design in the project.
        </Typography>
      </Box>
    </Stack>
  );
}
