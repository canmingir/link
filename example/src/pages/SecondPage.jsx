import { Container, Typography } from "@mui/material";
function SecondPage() {
  return (
    <Container
      sx={{
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3">Second Page</Typography>
    </Container>
  );
}

export default SecondPage;
