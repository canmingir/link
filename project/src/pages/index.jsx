import { Container, Typography } from "@mui/material";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStorage } from "@nucleoidjs/webstorage";

const Index = () => {
  const navigate = useNavigate();
  const [itemId] = useStorage("projectId", null);

  useEffect(() => {
    if (itemId) {
      navigate("/emperor");
    }
  }, [itemId]);

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
      <Typography variant="h3">Select An Emperor</Typography>
    </Container>
  );
};

export default Index;
