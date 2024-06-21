import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Iconify from "../../components/Iconify";
import PropTypes from "prop-types";
import React from "react";
import { motion } from "framer-motion";
import { useSettingsContext } from "../../components/settings";
import { varHover } from "../../components/animate";

import Badge, { badgeClasses } from "@mui/material/Badge";

// ----------------------------------------------------------------------

export default function SettingsButton({ sx }) {
  const settings = useSettingsContext();

  return (
    <Badge
      color="info"
      variant="dot"
      invisible={!settings.canReset}
      sx={{
        [`& .${badgeClasses.badge}`]: {
          top: 8,
          right: 8,
        },
        ...sx,
      }}
    >
      <Box
        component={motion.div}
        animate={{
          rotate: [0, settings.open ? 0 : 360],
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <IconButton
          component={motion.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          aria-label="settings"
          onClick={settings.onToggle}
          sx={{
            width: 40,
            height: 40,
          }}
        >
          <Iconify icon="solar:settings-bold-duotone" width={24} />
        </IconButton>
      </Box>
    </Badge>
  );
}

SettingsButton.propTypes = {
  sx: PropTypes.object,
};
