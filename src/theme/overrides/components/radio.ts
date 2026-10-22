import type { Theme } from "@mui/material/styles";
export function radio(theme: Theme): Record<string, unknown> {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          ...theme.typography.body2,
        },
      },
    },

    MuiRadio: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
  };
}
