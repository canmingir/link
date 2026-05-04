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
