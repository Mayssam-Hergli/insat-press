/**
 * Helpers for `<input type="datetime-local">` fields in the admin forms.
 *
 * The input works with a local `YYYY-MM-DDTHH:mm` string, while Prisma/the API
 * expect an ISO-8601 string (or null when the field is empty).
 */

/** Format a Date (or ISO string) into the value a datetime-local input expects. */
export function toDateTimeLocalValue(
  date: Date | string | null | undefined
): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

/** Convert a datetime-local input value into an ISO string, or null when empty. */
export function dateTimeLocalToISO(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}
