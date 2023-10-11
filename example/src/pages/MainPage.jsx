import { Container, Button, Typography } from "@mui/material";
import { message } from "../../../index";
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
      <Typography variant="h3">
        <Button onClick={() => message.success("a")}>test</Button>
      </Typography>
    </Container>
  );
}

export default MainPage;
