import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { alpha } from "@mui/material";
import useEmperor from "../hooks/useEmperor";
import { useStorage } from "@nucleoidjs/webstorage";

const Emperor = () => {
  const { getEmperorById } = useEmperor();
  const [emperor, setEmperor] = useState({});
  const [itemId] = useStorage("itemId", null);

  useEffect(() => {
    const fetchEmperorById = async () => {
      const data = await getEmperorById(itemId);
      setEmperor(data);
    };

    fetchEmperorById();
  }, [itemId]);

  return (
    <>
      <Box
        sx={{
          mt: 5,
          mb: 5,
          width: 1,
          height: "100%",
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          p={5}
        >
          <Box
            component={"img"}
            src={emperor.portrait}
            sx={{ width: "10rem", borderWidth: 2, borderRadius: "2rem" }}
          />
          <Typography variant="h2">{emperor.name}</Typography>
          <Typography variant="subtitle1">Reign: {emperor.reign}</Typography>
          <Typography variant="subtitle2">Born: {emperor.born}</Typography>
          <Stack width={"70rem"} m={2}>
            <Typography variant="body1">{emperor.description}</Typography>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default Emperor;
