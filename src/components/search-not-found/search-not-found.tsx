import Paper from "@mui/material/Paper";
import type { PaperProps } from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface SearchNotFoundProps extends Omit<PaperProps, "children"> {
  query?: string;
}

export default function SearchNotFound({
  query,
  sx,
  ...other
}: SearchNotFoundProps) {
  return query ? (
    <Paper
      sx={[
        {
          bgcolor: "unset",
          textAlign: "center",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography variant="h6" gutterBottom>
        Not Found
      </Typography>

      <Typography variant="body2">
        No results found for &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> Try checking for typos or using complete words.
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      Please enter keywords
    </Typography>
  );
}
