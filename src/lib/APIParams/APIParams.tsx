import { Add } from "@mui/icons-material";
import type { MutableRefObject } from "react";
import ParamTable from "../ParamTable";

import { Box, Fab } from "@mui/material";
import type { NamedType, Param } from "../ParamTable/types";
import { useEffect, useState } from "react";

interface APIParamsProps {
  types: NamedType[];
  paramsRef: MutableRefObject<Param[]>;
  addParams?: MutableRefObject<(() => void) | null>;
}

const APIParams = ({ types, paramsRef, addParams }: APIParamsProps) => {
  const [params, setParams] = useState<Param[]>(paramsRef.current);

  useEffect(() => {
    setParams(paramsRef.current);
  }, [paramsRef]);

  useEffect(() => {
    paramsRef.current = params;
  }, [params, paramsRef]);

  const handleAddParams = () => {
    const id = Date.now().toString();
    const newParam: Param = {
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
          <Add />
        </Fab>
      </Box>
    </Box>
  );
};

export default APIParams;
