import { formLabelClasses } from "@mui/material/FormLabel";
import { inputLabelClasses } from "@mui/material/InputLabel";

// ----------------------------------------------------------------------

export function formControl(theme) {
  return {
    MuiFormControl: {
      defaultProps: {
        variant: "outlined",
        size: "small",
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
