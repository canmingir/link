import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Iconify from "../../components/Iconify";
import SettingsDialog from "../../widgets/SettingsDialog";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSettingsContext } from "../../components/settings";
import { varHover } from "../../components/animate";

export default function SettingsButton() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settings = useSettingsContext();

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
          repeat: settings.animation ? Infinity : 0,
        }}
      >
        <IconButton
          component={motion.button}
          whileTap={settings.animation ? "tap" : undefined}
          whileHover={settings.animation ? "hover" : undefined}
          variants={settings.animation ? varHover(1.05) : undefined}
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
