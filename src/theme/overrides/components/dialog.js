export function dialog(theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: ({ ownerState }) => ({
          boxShadow: theme.customShadows.dialog,
          borderRadius: theme.shape.borderRadius * 2,
          ...(!ownerState.fullScreen && {
            margin: theme.spacing(2),
          }),
          ...(ownerState.type === "large" && {
            width: "100%",
            maxWidth: "none",
            height: "100%",
            outline: "none",
          }),
          ...(ownerState.type === "medium" && {
            width: "80%",
            maxWidth: "none",
            height: "80vh",
            outline: "none",
          }),
          ...(ownerState.type === "small" && {
            height: "50vh",
            width: "50%",
            outline: "none",
          }),
            ...(ownerState.type === "xsmall" && {
            width: 350,
            height: "18vh",
            outline: "none",
        }),
        }),
        paperFullScreen: {
          borderRadius: 0,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(0, 3),
        },
        dividers: {
          borderTop: 0,
          borderBottomStyle: "dashed",
          paddingBottom: theme.spacing(3),
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
          "& > :not(:first-of-type)": {
            marginLeft: theme.spacing(1.5),
          },
        },
      },
    },
  };
}
