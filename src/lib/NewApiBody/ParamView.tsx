import { v4 as uuid } from "uuid";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export interface ViewParam {
  name?: string;
  type?: string;
}

function ParamView({ params }: { params?: ViewParam[] }) {
  const rows = params || [];

  return (
    <Table size={"small"} data-cy="param-view">
      <colgroup>
        <col style={{ width: "50%" }} />
        <col style={{ width: "50%" }} />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell>Parameter</TableCell>
          <TableCell>Data Type</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((param) => (
          <TableRow key={uuid()}>
            <TableCell>{param.name}</TableCell>
            <TableCell>{param.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ParamView;
