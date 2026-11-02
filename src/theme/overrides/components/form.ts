import type { Theme } from "@mui/material/styles";
export function formControl(theme: Theme) {
  return {
    MuiFormControl: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 1,
        },
      },
    },
  };
}
