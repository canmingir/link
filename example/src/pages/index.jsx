import { Button, Container, Typography } from "@mui/material";

import { Link } from "react-router-dom";

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
        backgroundColor: "green",
      }}
    >
      <Typography variant="h3">Index</Typography>
      <Button sx={{ backgroundColor: "black" }}>
        <Link to={"/main"}>Next Page</Link>
      </Button>
    </Container>
  );
};

export default Index;
