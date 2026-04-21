import { buttonClasses } from "@mui/material/Button";

// ----------------------------------------------------------------------

export function loadingButton(theme) {
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === "soft" && {
            [`& .${buttonClasses.loadingIndicatorStart}`]: {
              left: 10,
            },
            [`& .${buttonClasses.loadingIndicatorEnd}`]: {
              right: 14,
            },
            ...(ownerState.size === "small" && {
              [`& .${buttonClasses.loadingIndicatorStart}`]: {
                left: 10,
              },
              [`& .${buttonClasses.loadingIndicatorEnd}`]: {
                right: 10,
              },
            }),
          }),
        }),
      },
    },
  };
}
