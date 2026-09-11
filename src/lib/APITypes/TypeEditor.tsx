import { useState } from "react";

import { Box, IconButton, TextField } from "@mui/material";
import { Check, Close } from "@mui/icons-material";

interface TypeEditorProps {
  initialValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

const TypeEditor = ({
  initialValue = "",
  onConfirm,
  onCancel,
}: TypeEditorProps) => {
  const [typeName, setTypeName] = useState(initialValue);

  const handleConfirm = () => {
    onConfirm(typeName);
    setTypeName("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <TextField
        value={typeName}
        onChange={(e) => setTypeName(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ width: "60%", marginRight: 1 }}
        data-cy="type-name-input"
      />
      <Box>
        <IconButton
          onClick={handleConfirm}
          size="small"
          data-cy="confirm-type-button"
        >
          <Check />
        </IconButton>
        <IconButton onClick={onCancel} size="small">
          <Close />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TypeEditor;
