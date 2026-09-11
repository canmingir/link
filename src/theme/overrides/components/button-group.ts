import type { ButtonGroupProps } from "@mui/material/ButtonGroup";
import type { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { buttonGroupClasses } from "@mui/material/ButtonGroup";

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"] as const;

type ButtonGroupOwnerState = Omit<ButtonGroupProps, "variant"> & {
  variant?: "contained" | "outlined" | "text" | "soft";
};

export function buttonGroup(theme: Theme) {
  const rootStyles = (ownerState: ButtonGroupOwnerState) => {
    const inheritColor = ownerState.color === "inherit";

    const containedVariant = ownerState.variant === "contained";

    const outlinedVariant = ownerState.variant === "outlined";

    const textVariant = ownerState.variant === "text";

    const softVariant = ownerState.variant === "soft";

    const horizontalOrientation = ownerState.orientation === "horizontal";

    const verticalOrientation = ownerState.orientation === "vertical";

    const defaultStyle = {
      [`& .${buttonGroupClasses.grouped}`]: {
        "&:not(:last-of-type)": {
          ...(!outlinedVariant && {
            borderStyle: "solid",
            ...(inheritColor && {
              borderColor: alpha(theme.palette.grey[500], 0.32),
            }),
            ...(horizontalOrientation && {
              borderWidth: "0px 1px 0px 0px",
            }),
            ...(verticalOrientation && {
              borderWidth: "0px 0px 1px 0px",
            }),
          }),
        },
      },
    };

    const colorStyle = COLORS.map((color) => ({
      [`& .${buttonGroupClasses.grouped}`]: {
        "&:not(:last-of-type)": {
          ...(!outlinedVariant && {
            ...(ownerState.color === color && {
              ...(containedVariant && {
                borderColor: alpha(theme.palette[color].dark, 0.48),
              }),
              ...(textVariant && {
                borderColor: alpha(theme.palette[color].main, 0.48),
              }),
              ...(softVariant && {
                borderColor: alpha(theme.palette[color].dark, 0.24),
              }),
            }),
          }),
        },
      },
    }));

    const disabledState = {
      [`& .${buttonGroupClasses.grouped}`]: {
        [`&.${buttonGroupClasses.disabled}`]: {
          "&:not(:last-of-type)": {
            borderColor: theme.palette.action.disabledBackground,
          },
        },
      },
    };

    return [defaultStyle, ...colorStyle, disabledState];
  };

  return {
    MuiButtonGroup: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: ButtonGroupOwnerState }) =>
          rootStyles(ownerState),
      },
    },
  };
}
