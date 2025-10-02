import Box from "@mui/material/Box";
import React from "react";
import { motion } from "framer-motion";
import { useResponsive } from "../../hooks/use-responsive";
import { varContainer } from "./variants";

export default function MotionViewport({
  children,
  disableAnimatedMobile = true,
  ...other
}) {
  const smDown = useResponsive("down", "sm");

  if (smDown && disableAnimatedMobile) {
    return <Box {...other}>{children}</Box>;
  }

  return (
    <Box
      component={motion.div}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  );
}
