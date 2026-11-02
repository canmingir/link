import { format, formatDistanceToNow, getTime } from "date-fns";

export function fDate(
  date: Date | string | number | null | undefined,
  newFormat?: string
) {
  const fm = newFormat || "dd MMM yyyy";

  return date ? format(new Date(date), fm) : "";
}

export function fDateTime(
  date: Date | string | number | null | undefined,
  newFormat?: string
) {
  const fm = newFormat || "dd MMM yyyy p";

  return date ? format(new Date(date), fm) : "";
}

export function fTimestamp(date: Date | string | number | null | undefined) {
  return date ? getTime(new Date(date)) : "";
}

export function fToNow(date: Date | string | number | null | undefined) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : "";
}
