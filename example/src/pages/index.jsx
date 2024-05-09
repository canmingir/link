import { Container, Typography } from "@mui/material";

const Index = () => {
  return (
    <Container
      sx={{
        height: "100dvh",
        width: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3">Index</Typography>
    </Container>
  );
};

export default Index;
