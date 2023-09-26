import AddCircleIcon from "@mui/icons-material/AddCircle";
import styles from "./styles";

import { Card, Container } from "@mui/material";
import React, { useEffect, useState } from "react";

function AddNewButton({ type, addNew, onClickFunction }) {
  const [size, setSize] = useState({});

  useEffect(() => {
    switch (type) {
      case "largeButton":
        setSize(styles.largeButton);

        break;
      case "wideButton":
        setSize(styles.wideButton);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container sx={{ width: size.containerWidth }}>
      <Card
        onClick={onClickFunction}
        variant="contained"
        sx={{
          ...styles.default,
          width: size.width,
          height: size.height,
          borderRadius: size.borderRadius,
          marginLeft: size.marginLeft,
          minWidth: size.minWidth,
          maxHeight: size.maxHeight,
        }}
      >
        <AddCircleIcon fontSize="large" />
        Add new {addNew}
      </Card>
    </Container>
  );
}

export default AddNewButton;
