import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
} from "@mui/icons-material";

function Arrow({
  up,
  down,
  right,
  left,
}: {
  up?: boolean;
  down?: boolean;
  right?: boolean;
  left?: boolean;
}) {
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
