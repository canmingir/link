import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Iconify from "../../components/Iconify";
import React from "react";
import SettingsDialog from "../../widgets/SettingsDialog";
import { motion } from "framer-motion";
import { varHover } from "../../components/animate";

export default function SettingsButton({ sx }) {
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <>
      <Box
        component={motion.div}
        animate={{
          rotate: [0, settingsOpen ? 0 : 360],
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
          onClick={() => setSettingsOpen(true)}
          sx={{
            width: 40,
            height: 40,
          }}
        >
          <Iconify icon="solar:settings-bold-duotone" width={24} />
        </IconButton>
      </Box>
      <SettingsDialog
        open={settingsOpen}
        handleClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
