import Box from "@mui/material/Box";
import Label from "../../../components/label";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import SvgColor from "../../../components/svg-color";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import { Stack, Typography, useMediaQuery } from "@mui/material";

export default function ResultItem({
  title,
  icon,
  groupLabel,
  onClickItem,
  name,
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(435));

  const displayTitle = isSmallScreen
    ? title
        .map((part) => part.text)
        .join(" ")
        .split(" ")
        .slice(0, 2)
        .join(" ")
    : title.map((part, index) => (
        <Box
          key={index}
          component="span"
          sx={{ color: part.highlight ? "primary.main" : "text.primary" }}
        >
          {part.text}
        </Box>
      ));

  const displayName = isSmallScreen
    ? name.split(" ").slice(0, 2).join(" ")
    : name;

  return (
    <ListItemButton
      data-cy="item-button"
      onClick={onClickItem}
      sx={{
        borderBottom: `1px dashed ${theme.palette.divider}`,
        "&:hover": {
          borderRadius: 1,
          borderColor: "primary.main",
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.hoverOpacity
          ),
          borderStyle: "dashed",
          borderWidth: 1,
        },
      }}
    >
      <Stack>
        <SvgColor
          src={`https://api.iconify.design/${icon}.svg`}
          sx={{
            width: 32,
            height: 32,
            mx: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }}
        />
      </Stack>

      <ListItemText
        primary={
          <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
            {displayTitle}
          </Typography>
        }
      />

      <Label
        sx={{ height: "auto", whiteSpace: "normal", wordWrap: "break-word" }}
      >
        <Typography variant="caption">{displayName}</Typography>
      </Label>

      {groupLabel && <Label color="info">{groupLabel}</Label>}
    </ListItemButton>
  );
}
