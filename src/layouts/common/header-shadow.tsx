import Box from "@mui/material/Box";

import type { SxProps, Theme } from "@mui/material/styles";

export default function HeaderShadow({
  sx,
  ...other
}: {
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}) {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        m: "auto",
        height: 24,
        zIndex: -1,
        opacity: 0.48,
        borderRadius: "50%",
        position: "absolute",
        width: `calc(100% - 48px)`,
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx,
      }}
      {...other}
    />
  );
}
