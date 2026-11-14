const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Checks whether a date input includes an explicit time component (e.g., ISO airstamp).
 */
export function hasTimeComponent(
  targetDate: string | number | Date | null | undefined,
): boolean {
  if (!targetDate) return false;
  if (targetDate instanceof Date || typeof targetDate === "number") return true;
  return !DATE_ONLY_REGEX.test(targetDate.trim()) && targetDate.includes("T");
}

/**
 * Parses a countdown target date into UTC epoch milliseconds.
 * Date-only strings ("YYYY-MM-DD") are parsed as local midnight instead of UTC midnight
 * so local-day countdowns do not shift by the browser's UTC offset.
 * Full ISO timestamps with timezone offsets (e.g., TVMaze airstamp) parse to their exact instant.
 */
export function parseCountdownTargetTime(
  targetDate: string | number | Date | null | undefined,
): number | null {
  if (targetDate === null || targetDate === undefined || targetDate === "") {
    return null;
  }

  if (typeof targetDate === "number") {
    return Number.isFinite(targetDate) ? targetDate : null;
  }

  if (targetDate instanceof Date) {
    const ms = targetDate.getTime();
    return Number.isNaN(ms) ? null : ms;
  }

  const trimmed = targetDate.trim();
  const dateOnlyMatch = DATE_ONLY_REGEX.exec(trimmed);
  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const month = Number(dateOnlyMatch[2]);
    const day = Number(dateOnlyMatch[3]);
    const localMidnight = new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
    return Number.isNaN(localMidnight) ? null : localMidnight;
  }

  const parsed = new Date(trimmed).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Formats an air date (and optional ISO airstamp) in the user's local timezone.
 * When `airstamp` is present, both the converted local date and local time + timezone
 * abbreviation (e.g., "9:00 AM WIB" / "GMT+7") are returned.
 */
export function formatLocalAirDateTime(
  airDate: string,
  airstamp?: string | null,
  dateStyle: "long" | "short" = "long",
): { dateText: string; timeText: string | null } {
  const source = airstamp && hasTimeComponent(airstamp) ? airstamp : airDate;
  const targetMs = parseCountdownTargetTime(source);
  if (targetMs === null) {
    return { dateText: airDate, timeText: null };
  }

  const dateObj = new Date(targetMs);
  const dateText =
    dateStyle === "long"
      ? new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(dateObj)
      : new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(dateObj);

  if (!airstamp || !hasTimeComponent(airstamp)) {
    return { dateText, timeText: null };
  }

  const timeText = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(dateObj);

  return { dateText, timeText };
}
