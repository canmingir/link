export function formControl(theme) {
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
