import { Box, Divider, Typography } from "@mui/material";

import React from "react";
import { useTheme } from "@mui/material/styles";

const GlassCard = ({ children, sx = {}, ...props }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}05 100%)`,
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: "hidden",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

const GlassCardHeader = ({
  title,
  subheader,
  action,
  divider = true,
  sx = {},
}) => (
  <>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1.5,
        py: 0.75,
        minHeight: 40,
        flexShrink: 0,
        ...sx,
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        {title && (
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: 600, lineHeight: 1.3, fontSize: "0.8125rem" }}
          >
            {title}
          </Typography>
        )}
        {subheader && (
          <Typography
            variant="body2"
            noWrap
            sx={{ color: "text.secondary", lineHeight: 1.3, display: "block" }}
          >
            {subheader}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ ml: 1, flexShrink: 0 }}>{action}</Box>}
    </Box>
    {divider && <Divider />}
  </>
);

const GlassCardContent = ({ children, sx = {}, ...props }) => (
  <Box
    sx={{
      flex: 1,
      overflow: "auto",
      position: "relative",
      p: 0,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
);

const GlassCardActions = ({ children, sx = {}, ...props }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      px: 1.5,
      py: 0.75,
      flexShrink: 0,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
);

export { GlassCardHeader, GlassCardContent, GlassCardActions };
export default GlassCard;
