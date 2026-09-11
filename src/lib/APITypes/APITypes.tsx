import type { ApiType } from "./types";
import type { Ref } from "react";
import Schema from "../Schema/Schema";
import SchemaEditor from "../SchemaEditor";
import type { SchemaEditorHandle } from "../SchemaEditor/SchemaEditor";
import TypeList from "./TypeList";
import { publish } from "@nucleoidai/react-event";
import { useState } from "react";

import { Box, Divider, Paper } from "@mui/material";

interface APITypesProps {
  tstypes: ApiType[];
  nuctypes: ApiType[];
  typesRef?: Ref<SchemaEditorHandle>;
}

const APITypes = ({ tstypes, nuctypes, typesRef }: APITypesProps) => {
  const combinedData: ApiType[] = [
    ...tstypes.map((item) => ({ ...item, isTypeScript: true })),
    ...nuctypes.map((item) => ({ ...item, isTypeScript: false })),
  ];
  const [selectedType, setSelectedType] = useState<string | null>(
    combinedData.length > 0 ? combinedData[0].name : null
  );
  const preloaded: Record<string, boolean> = {};
  combinedData.forEach((item) => {
    preloaded[item.name] = true;
  });

  const isTypeScriptType = (typeName: string) => {
    return tstypes.some((type) => type.name === typeName);
  };

  const handleAddType = (typeName: string) => {
    publish("API_TYPE_ADD", { typeName });
  };

  const handleDeleteType = (typeName: string) => {
    publish("API_TYPE_DELETE", { typeName });
  };

  const handleUpdateType = (
    oldTypeName: string | null,
    newTypeName: string
  ) => {
    publish("API_TYPE_RENAME", { oldTypeName, newTypeName });
  };

  const renderRightPanel = () => {
    if (!selectedType) return null;

    const useSchemaEditor = !isTypeScriptType(selectedType);
    const initialData = findSchemaByName(selectedType);

    return (
      <Box sx={{ width: "100%", height: "100%" }} data-cy="type-schema-editor">
        {useSchemaEditor ? (
          <SchemaEditor
            key={selectedType}
            ref={typesRef}
            initialData={initialData}
          />
        ) : (
          <Schema initialData={initialData} />
        )}
      </Box>
    );
  };

  const handleTypeSelect = (name: string | null) => {
    setSelectedType(name);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "85%",
        p: 2,
      }}
      data-cy="api-types"
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TypeList
            combinedData={combinedData}
            selectedType={selectedType}
            onTypeSelect={handleTypeSelect}
            onAddType={handleAddType}
            onUpdateType={handleUpdateType}
            onDeleteType={handleDeleteType}
          />
        </Paper>
      </Box>
      <Divider orientation="vertical" flexItem sx={{ width: "1rem" }} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {renderRightPanel()}
        </Paper>
      </Box>
    </Box>
  );

  function findSchemaByName(name: string | null) {
    const schema = combinedData.find((schema) => schema.name === name);
    return schema?.schema ?? undefined;
  }
};

export default APITypes;
