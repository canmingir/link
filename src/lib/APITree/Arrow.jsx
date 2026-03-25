import React from "react";

import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
} from "@mui/icons-material";

function Arrow({ up, down, right, left }) {
  return up ? (
    <KeyboardArrowUp />
  ) : down ? (
    <KeyboardArrowDown />
  ) : right ? (
    <KeyboardArrowRight />
  ) : left ? (
    <KeyboardArrowLeft />
  ) : null;
}

export default Arrow;
