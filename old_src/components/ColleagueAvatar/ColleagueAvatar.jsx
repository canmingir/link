import styles from "./styles";

import { Avatar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

function ColleagueAvatar({ colleague, sizeFor }) {
  const [size, setSize] = useState({});

  useEffect(() => {
    switch (sizeFor) {
      case "teamCard":
        setSize(styles.teamCard);
        break;
      case "colleagueCard":
        setSize(styles.colleagueCard);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Avatar
      alt={colleague.name}
      sx={{
        ...styles.avatar,
        width: size.width,
        height: size.height,
      }}
    >
      <Typography sx={{ fontSize: size.fontSize }}>
        {colleague.name ? colleague.name[0].toUpperCase() : ""}
      </Typography>
    </Avatar>
  );
}

export default ColleagueAvatar;
