import AddIcon from "@mui/icons-material/Add";
import ParamTable from "../ParamTable";

import { Box, Fab } from "@mui/material";
import { useEffect, useState } from "react";

const APIParams = ({ types, paramsRef, addParams }) => {
  const [params, setParams] = useState(paramsRef.current);

  useEffect(() => {
    setParams(paramsRef.current);
  }, [paramsRef]);

  useEffect(() => {
    paramsRef.current = params;
  }, [params, paramsRef]);

  const handleAddParams = () => {
    const id = Date.now().toString();
    const newParam = {
      id,
      in: "query",
      type: "string",
      required: true,
    };
    setParams((prevParams) => [...prevParams, newParam]);
  };

  if (addParams) {
    addParams.current = handleAddParams;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "85%",
        p: 2,
      }}
      data-cy="api-params"
    >
      <ParamTable types={types} params={params} setParams={setParams} />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Fab
          size={"small"}
          onClick={handleAddParams}
          data-cy="add-param-button"
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default APIParams;
