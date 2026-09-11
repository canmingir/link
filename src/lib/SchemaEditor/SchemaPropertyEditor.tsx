import type { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

import { Box, Input, MenuItem, Select, Typography } from "@mui/material";
import type { CustomType, SchemaNode, SchemaType } from "./types";

type EditMode = "name" | "type" | null;

interface SchemaPropertyEditorProps {
  node: SchemaNode & { level?: number };
  onNameChange: (newName: string) => void;
  disableNameChange?: boolean;
  onTypeChange: (newType: SchemaType) => void;
  customTypes: CustomType[];
}

const SchemaPropertyEditor = ({
  node,
  onNameChange,
  disableNameChange,
  onTypeChange,
  customTypes,
}: SchemaPropertyEditorProps) => {
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [name, setName] = useState(node.name || "");
  const [type, setType] = useState(node.type);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleNameChange = (newName: string) => {
    setName(newName);
    onNameChange(newName);
  };

  const handleTypeChange = (newType: SchemaType) => {
    setType(newType);
    onTypeChange(newType);
    setEditMode(null);
    setIsSelectOpen(false);
  };

  const isRootNode = node.level === 0;

  const propertyTypes = isRootNode
    ? ["object", "array", ...customTypes.map((t) => t.name)]
    : [
        "string",
        "number",
        "boolean",
        "object",
        "array",
        ...customTypes.map((t) => t.name),
      ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        gap: "4px",
      }}
    >
      {!disableNameChange ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            gap: "4px",
          }}
          onClick={() => {
            setEditMode("name");
          }}
        >
          <Input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            disableUnderline
            fullWidth
            sx={{
              borderBottom: "2px solid transparent",
              "&:hover": {
                borderBottom: "2px solid gray",
              },
              "&:focus": {
                borderBottom: "2px solid blue",
              },
            }}
            data-cy={`property-name-field-${node.id}`}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        ></Box>
      )}

      {editMode === "type" ? (
        <Select
          open={isSelectOpen}
          value={type}
          onChange={(e: SelectChangeEvent) =>
            handleTypeChange(e.target.value as SchemaType)
          }
          onClose={() => {
            setEditMode(null);
            setIsSelectOpen(false);
          }}
          onOpen={() => setIsSelectOpen(true)}
        >
          {propertyTypes.map((typeOption) => (
            <MenuItem
              value={typeOption}
              key={typeOption}
              data-cy={`property-type-option-${typeOption}`}
            >
              {typeOption}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <Typography
            variant="body2"
            onClick={() => {
              setEditMode("type");
              setIsSelectOpen(true);
            }}
            sx={{
              cursor: "pointer",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.grey[600],
              },
            }}
            data-cy={`property-type-select-${node.id}`}
          >
            {node.type}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SchemaPropertyEditor;
