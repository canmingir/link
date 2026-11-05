import Iconify from "../Iconify";
import type { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

import {
  Box,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ChatInputErrors, ChatInputField, ChatInputSubmit } from "./types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type FormValues = Record<string, string | boolean>;

function parseValues(fields: ChatInputField[], values: FormValues) {
  const result: Record<string, unknown> = {};
  const errors: ChatInputErrors = {};

  for (const field of fields) {
    const raw = values[field.name];

    if (field.type === "boolean") {
      if (typeof raw === "boolean") result[field.name] = raw;
      else if (field.required) result[field.name] = false;
      continue;
    }

    const text = typeof raw === "string" ? raw : "";

    if (!text.trim()) {
      if (field.required) errors[field.name] = "Required";
      continue;
    }

    if (field.type === "number") {
      const number = Number(text);
      if (Number.isNaN(number)) errors[field.name] = "Must be a number";
      else result[field.name] = number;
      continue;
    }

    if (field.type === "object" || field.type === "array") {
      try {
        const parsed = JSON.parse(text);
        const matches =
          field.type === "array"
            ? Array.isArray(parsed)
            : parsed !== null &&
              typeof parsed === "object" &&
              !Array.isArray(parsed);

        if (matches) result[field.name] = parsed;
        else errors[field.name] = `Must be a JSON ${field.type}`;
      } catch {
        errors[field.name] = "Invalid JSON";
      }
      continue;
    }

    result[field.name] = text;
  }

  return { result, errors };
}

const InputForm = ({
  fields,
  onSubmit,
}: {
  fields: ChatInputField[];
  onSubmit: ChatInputSubmit;
}) => {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<ChatInputErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const signature = useMemo(
    () => fields.map(({ name, type }) => `${name}:${type}`).join("|"),
    [fields]
  );

  useEffect(() => {
    setValues({});
    setErrors({});
    setFormError(null);
  }, [signature]);

  const setValue = useCallback((name: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;

    const { result, errors: parseErrors } = parseValues(fields, values);
    setErrors(parseErrors);
    setFormError(null);

    if (Object.keys(parseErrors).length) return;

    setSubmitting(true);
    try {
      const response = await onSubmit(result);
      if (typeof response === "string") setFormError(response);
      else if (response && Object.keys(response).length) setErrors(response);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to submit inputs"
      );
    } finally {
      setSubmitting(false);
    }
  }, [fields, values, onSubmit, submitting]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: (theme: Theme) => alpha(theme.palette.background.paper, 0.8),
    },
  };

  const renderField = (field: ChatInputField) => {
    const error = errors[field.name];
    const helperText = error ?? field.description;
    const value = values[field.name];

    if (field.type === "boolean") {
      return (
        <Box key={field.name}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={value === true}
                onChange={(event) => setValue(field.name, event.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                {field.name}
                {field.required ? " *" : ""}
              </Typography>
            }
          />
          {helperText && (
            <Typography
              variant="caption"
              display="block"
              sx={{ color: error ? "error.main" : "text.secondary" }}
            >
              {helperText}
            </Typography>
          )}
        </Box>
      );
    }

    const text = typeof value === "string" ? value : "";
    const isJson = field.type === "object" || field.type === "array";

    return (
      <TextField
        key={field.name}
        label={field.name}
        required={field.required}
        value={text}
        onChange={(event) => setValue(field.name, event.target.value)}
        error={Boolean(error)}
        helperText={helperText}
        size="small"
        fullWidth
        select={field.type === "enum"}
        type={field.type === "number" ? "number" : "text"}
        multiline={isJson}
        minRows={isJson ? 2 : undefined}
        placeholder={
          isJson ? (field.type === "array" ? "[]" : "{}") : undefined
        }
        sx={{
          ...fieldSx,
          ...(isJson && {
            "& textarea": { fontFamily: "monospace", fontSize: "0.75rem" },
          }),
        }}
      >
        {field.type === "enum" && [
          ...(field.required
            ? []
            : [
                <MenuItem key="" value="">
                  <em>None</em>
                </MenuItem>,
              ]),
          ...(field.values ?? []).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )),
        ]}
      </TextField>
    );
  };

  return (
    <Box sx={{ px: 2, pb: 2 }} onKeyDown={handleKeyDown}>
      <Box sx={{ maxHeight: 280, overflowY: "auto", pt: 1, pr: 0.5 }}>
        <Stack spacing={1.5}>{fields.map(renderField)}</Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: formError
              ? "error.main"
              : (theme) => alpha(theme.palette.text.secondary, 0.5),
            fontSize: "0.7rem",
          }}
        >
          {formError ?? "⌘↵ to submit"}
        </Typography>
        <Tooltip title="Submit inputs (⌘↵)" placement="top">
          <span>
            <IconButton
              onClick={handleSubmit}
              size="small"
              disabled={submitting}
              sx={{ color: (theme) => theme.palette.primary.light }}
            >
              <Iconify
                icon="material-symbols:send"
                sx={{ width: 18, height: 18 }}
              />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default InputForm;
