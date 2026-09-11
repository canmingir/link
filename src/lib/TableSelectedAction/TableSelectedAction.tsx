import Checkbox from "@mui/material/Checkbox";
import type { ReactNode } from "react";
import Stack from "@mui/material/Stack";
import type { StackProps } from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type TableSelectedActionProps = {
  dense?: boolean;
  action?: ReactNode;
  rowCount: number;
  numSelected: number;
  onSelectAllRows: (checked: boolean) => void;
} & StackProps;

export default function TableSelectedAction({
  dense,
  action,
  rowCount,
  numSelected,
  onSelectAllRows,
  sx,
  ...other
}: TableSelectedActionProps) {
  if (!numSelected) {
    return null;
  }

  return (
    <Stack
      direction="row"
      {...other}
      sx={[
        {
          alignItems: "center",
          pl: 1,
          pr: 2,
          top: 0,
          left: 0,
          width: 1,
          zIndex: 9,
          height: 58,
          position: "absolute",
          bgcolor: "primary.lighter",

          ...(dense && {
            height: 38,
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Checkbox
        indeterminate={!!numSelected && numSelected < rowCount}
        checked={!!rowCount && numSelected === rowCount}
        onChange={(event) => onSelectAllRows(event.target.checked)}
      />
      <Typography
        variant="subtitle2"
        sx={{
          ml: 2,
          flexGrow: 1,
          color: "primary.main",
          ...(dense && {
            ml: 3,
          }),
        }}
      >
        {numSelected} selected
      </Typography>
      {action && action}
    </Stack>
  );
}
