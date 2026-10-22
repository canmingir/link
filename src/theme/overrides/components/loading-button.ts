import type { ButtonProps } from "@mui/material/Button";
import type { Theme } from "@mui/material/styles";

const loadingIndicatorStart = "MuiButton-loadingIndicatorStart";
const loadingIndicatorEnd = "MuiButton-loadingIndicatorEnd";

export function loadingButton(_theme?: Theme) {
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: ({
          ownerState,
        }: {
          ownerState: Omit<ButtonProps, "variant"> & {
            variant?: "contained" | "outlined" | "text" | "soft";
          };
        }) => ({
          ...(ownerState.variant === "soft" && {
            [`& .${loadingIndicatorStart}`]: {
              left: 10,
            },
            [`& .${loadingIndicatorEnd}`]: {
              right: 14,
            },
            ...(ownerState.size === "small" && {
              [`& .${loadingIndicatorStart}`]: {
                left: 10,
              },
              [`& .${loadingIndicatorEnd}`]: {
                right: 10,
              },
            }),
          }),
        }),
      },
    },
  };
}
