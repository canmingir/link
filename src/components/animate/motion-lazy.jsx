import React from "react";

import { LazyMotion, domMax, motion } from "framer-motion";

export function MotionLazy({ children }) {
  return (
    <LazyMotion strict features={domMax}>
      <motion.div style={{ height: "100%" }}> {children} </motion.div>
    </LazyMotion>
  );
}
