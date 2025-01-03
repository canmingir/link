import Box from "@mui/material/Box";
import Label from "../../../components/label";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import SvgColor from "../../../components/svg-color";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import { Stack, Typography, useMediaQuery } from "@mui/material";

// ----------------------------------------------------------------------

export default function ResultItem({
  title,
  icon,
  groupLabel,
  onClickItem,
  name,
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(435));

  const renderTitle = () => {
    if (isSmallScreen) {
      const firstTwoWords = title
        .map((part) => part.text)
        .join(" ")
        .split(" ")
        .slice(0, 2)
        .join(" ");
      return (
        <Box
          component="span"
          sx={{
            color: "text.primary",
            typography: "subtitle2",
            textTransform: "capitalize",
          }}
        >
          {firstTwoWords}
        </Box>
      );
    } else {
      return title.map((part, index) => (
        <Box
          key={index}
          component="span"
          sx={{
            color: part.highlight ? "primary.main" : "text.primary",
          }}
        >
          {part.text}
        </Box>
      ));
    }
  };

  const renderName = () => {
    if (isSmallScreen) {
      const firstTwoWords = name.split(" ").slice(0, 2).join(" ");
      return firstTwoWords;
    } else {
      return name;
    }
  };

  return (
    <ListItemButton
      data-cy="item-button"
      onClick={onClickItem}
      sx={{
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "transparent",
        borderBottomColor: (theme) => theme.palette.divider,
        "&:hover": {
          borderRadius: 1,
          borderColor: (theme) => theme.palette.primary.main,
          backgroundColor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.hoverOpacity
            ),
        },
      }}
    >
      <Stack
        sx={{
          color: "text.disabled",
          typography: "subtitle2",
          "& .svg-color": {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          },
        }}
      >
        <SvgColor
          src={`https://api.iconify.design/${icon}.svg`}
          sx={{ width: 32, height: 32, mx: 2 }}
        />
      </Stack>
      <ListItemText
        primaryTypographyProps={{
          typography: "subtitle2",
          sx: { textTransform: "capitalize" },
        }}
        secondaryTypographyProps={{ typography: "caption" }}
        primary={renderTitle()}
      />
      <Label
        sx={{
          display: "block",
          whiteSpace: "normal",
          wordWrap: "break-word",
          height: "auto",
        }}
      >
        <Typography variant="caption">{renderName()}</Typography>
      </Label>
      {groupLabel && <Label color="info">{groupLabel}</Label>}
    </ListItemButton>
  );
}
