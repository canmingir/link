import useMediaQuery from "@mui/material/useMediaQuery";
import { Breakpoint, useTheme } from "@mui/material/styles";

type ResponsiveQuery = "up" | "down" | "between" | "only";

export function useResponsive(
  query: ResponsiveQuery,
  start?: Breakpoint | number,
  end?: Breakpoint | number
) {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(start ?? "xs"));

  const mediaDown = useMediaQuery(theme.breakpoints.down(start ?? "xs"));

  const mediaBetween = useMediaQuery(
    theme.breakpoints.between(start ?? "xs", end ?? "xl")
  );

  const mediaOnly = useMediaQuery(
    theme.breakpoints.only((start ?? "xs") as Breakpoint)
  );

  if (query === "up") {
    return mediaUp;
  }

  if (query === "down") {
    return mediaDown;
  }

  if (query === "between") {
    return mediaBetween;
  }

  return mediaOnly;
}

export function useWidth() {
  const theme = useTheme();

  const keys = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce<string | null>((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));

      return !output && matches ? key : output;
    }, null) || "xs"
  );
}
