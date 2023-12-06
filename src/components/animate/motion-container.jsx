import { motion } from "framer-motion";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import { varContainer } from "./variants";

// ----------------------------------------------------------------------

export default function MotionContainer({
  animate,
  action = false,
  children,
  ...other
}) {
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

MotionContainer.propTypes = {
  action: PropTypes.bool,
  animate: PropTypes.bool,
  children: PropTypes.node,
};
