import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";

import React from "react";
import { useTheme } from "@mui/material/styles";

const GlassCard = ({ children, sx = {}, ...props }) => {
  const theme = useTheme();

  return (
    <Card
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
    </Card>
  );
};

const GlassCardHeader = ({ divider = true, sx = {}, ...props }) => (
  <>
    <CardHeader
      sx={{
        px: 1.5,
        py: 0.75,
        "& .MuiCardHeader-title": {
          fontSize: "0.8125rem",
          fontWeight: 600,
          lineHeight: 1.3,
        },
        "& .MuiCardHeader-subheader": {
          fontSize: "0.75rem",
          lineHeight: 1.3,
        },
        ...sx,
      }}
      {...props}
    />
    {divider && <Divider />}
  </>
);

const GlassCardContent = ({ sx = {}, ...props }) => (
  <CardContent
    sx={{
      flex: 1,
      overflow: "auto",
      position: "relative",
      p: 0,
      "&:last-child": { pb: 0 },
      ...sx,
    }}
    {...props}
  />
);

const GlassCardActions = ({ sx = {}, ...props }) => (
  <CardActions
    sx={{
      px: 1.5,
      py: 0.75,
      flexShrink: 0,
      ...sx,
    }}
    {...props}
  />
);

export { GlassCardHeader, GlassCardContent, GlassCardActions };
export default GlassCard;
