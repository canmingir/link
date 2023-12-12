import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Label from "../../../components/label";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";
import React from "react";
import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function ResultItem({
  base,
  title,
  icon,
  groupLabel,
  onClickItem,
}) {
  return (
    <ListItemButton
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
      <Avatar
        src={`${base}/media/ProjectIcons/${icon?.replace(/:/g, "")}.png`}
        variant="square"
        sx={{ width: 30, height: 30, mx: 2 }}
      />
      <ListItemText
        primaryTypographyProps={{
          typography: "subtitle2",
          sx: { textTransform: "capitalize" },
        }}
        secondaryTypographyProps={{ typFography: "caption" }}
        primary={title.map((part, index) => (
          <Box
            key={index}
            component="span"
            sx={{
              color: part.highlight ? "primary.main" : "text.primary",
            }}
          >
            {part.text}
          </Box>
        ))}
      />
      {groupLabel && <Label color="info">{groupLabel}</Label>}
    </ListItemButton>
  );
}

ResultItem.propTypes = {
  base: PropTypes.string,
  groupLabel: PropTypes.string,
  onClickItem: PropTypes.func,
  icon: PropTypes.string,
  title: PropTypes.array,
};
