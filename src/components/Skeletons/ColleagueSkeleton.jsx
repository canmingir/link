import React from "react";

import { Avatar, Box } from "@mui/material";
import { Skeleton, Stack } from "@mui/material";

const ColleagueSkeleton = () => {
  return (
    <Stack
      spacing={1}
      sx={{
        cursor: "pointer",
        marginBottom: "20px",
        boxShadow: 2,
        border: "1px solid",
        borderColor: "divider",
        height: "9rem",
        display: "flex",
      }}
    >
      <Skeleton
        variant="box"
        sx={{ height: "2.9rem", display: "flex" }}
      ></Skeleton>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          justifyItems: "flex-start",
        }}
      >
        <Skeleton variant="circular">
          <Avatar
            sx={{
              height: "1rem",
              width: "6rem",
              marginTop: "50px",
            }}
          ></Avatar>
        </Skeleton>
        <Box>
          <Skeleton
            variant="text"
            sx={{ display: "flex", width: "200px", height: "25px" }}
          />
          <Skeleton
            variant="text"
            sx={{ display: "flex", width: "200px", height: "25px" }}
          />
          <Skeleton
            variant="text"
            sx={{ display: "flex", width: "200px", height: "25px" }}
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default ColleagueSkeleton;
