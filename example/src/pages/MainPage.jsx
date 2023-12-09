import { Box, Container, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

function MainPage() {
  return (
    <Container>
      <Typography variant="h3">Main</Typography>{" "}
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      />
    </Container>
  );
}

export default MainPage;
