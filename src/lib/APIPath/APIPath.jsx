import { Language } from "@mui/icons-material";
import styles from "./styles";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const APIPath = ({
  method,
  path,
  methodRef,
  pathRef,
  onTypesButtonClick,
  allowedMethods,
  isMethodDisabled,
  isPathDisabled,
  validatePath,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(
    allowedMethods.includes(method) ? method : allowedMethods[0] || ""
  );
  const [selectedPath, setSelectedPath] = useState("");

  useEffect(() => {
    methodRef.current = selectedMethod;
    pathRef.current = path + (path !== "/" ? "/" : "") + selectedPath;
    validatePath(selectedPath);
  }, [selectedMethod, selectedPath, methodRef, pathRef, path, validatePath]);

  return (
    <Grid container sx={styles.root} data-cy="api-path">
      <Grid sx={styles.firstElement} />
      <Grid item>
        <Grid container item sx={styles.content}>
          {isMethodDisabled ? (
            <Typography data-cy="method-text">{method}</Typography>
          ) : (
            <Select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              data-cy="method-select"
            >
              {allowedMethods.map((method) => (
                <MenuItem
                  key={method}
                  value={method}
                  data-cy={`method-menuitem-${method}`}
                >
                  {method}
                </MenuItem>
              ))}
            </Select>
          )}
          <Box component="span" sx={styles.text}></Box>
          <Typography data-cy="path-text">
            {path} {path !== "/" ? "/" : ""}
          </Typography>
          {!isPathDisabled && (
            <TextField
              value={selectedPath}
              onChange={(e) => setSelectedPath(e.target.value)}
              data-cy="path-input"
            />
          )}
        </Grid>
      </Grid>
      <Button onClick={onTypesButtonClick} data-cy="types-button">
        <Language sx={styles.icon} />
        Types
      </Button>
    </Grid>
  );
};

export default APIPath;
