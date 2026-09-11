import { format, formatDistanceToNow, getTime } from "date-fns";

type DateInput = Date | string | number | null | undefined;

export function fDate(date: DateInput, newFormat?: string) {
  const fm = newFormat || "dd MMM yyyy";

  return date ? format(new Date(date), fm) : "";
}

export function fDateTime(date: DateInput, newFormat?: string) {
  const fm = newFormat || "dd MMM yyyy p";

  return date ? format(new Date(date), fm) : "";
}

export function fTimestamp(date: DateInput) {
  return date ? getTime(new Date(date)) : "";
}

export function fToNow(date: DateInput) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : "";
}
