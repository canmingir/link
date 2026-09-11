import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { varContainer } from "./variants";

interface MotionContainerProps extends BoxProps {
  animate?: boolean;
  action?: boolean;
  children?: ReactNode;
}

export default function MotionContainer({
  animate,
  action = false,
  children,
  ...other
}: MotionContainerProps) {
  if (action) {
    return (
      <Box
        component={motion.div}
        initial={false}
        animate={animate ? "animate" : "exit"}
        variants={varContainer()}
        {...other}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  );
}
