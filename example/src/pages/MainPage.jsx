import { Container, Typography } from "@mui/material";
function MainPage() {
  return (
    <Container
      sx={{
        backgroundColor: "red",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <Typography variant="h3">Main</Typography>
    </Container>
  );
}

export default MainPage;
