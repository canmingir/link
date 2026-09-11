import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
} from "@mui/icons-material";

interface ArrowProps {
  up?: boolean;
  down?: boolean;
  right?: boolean;
  left?: boolean;
}

function Arrow({ up, down, right, left }: ArrowProps) {
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
