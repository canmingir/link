import { Button, Typography } from "@mui/material";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import config from "../../config";
import { publish } from "@nucleoidjs/react-event";

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
        <Button
          onClick={handleClick}
          sx={{ width: "2rem", height: "2rem", bgcolor: "red" }}
        >
          a
        </Button>
        <Typography>
          Page created according to Atomic Design in the project.
        </Typography>
      </Box>
    </Stack>
  );
}
