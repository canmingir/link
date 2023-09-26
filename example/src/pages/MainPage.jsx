import { Container, Typography } from "@mui/material";
function MainPage() {
  return (
    <Container
      sx={{
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3">Main</Typography>
    </Container>
  );
}

export default MainPage;
