import { useLocale } from "next-intl";

/**
 * Get user's timezone from browser
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC"; // Fallback to UTC if detection fails
  }
}

/**
 * Format date with timezone awareness based on current locale and user's timezone
 */
export function formatDate(
  dateString: string,
  locale?: string,
  timezone?: string
): string {
  const date = new Date(dateString);

  // Use provided locale or default to 'en-US'
  const targetLocale = locale || "en-US";
  const targetTimezone = timezone || getUserTimezone();

  // Map our app locales to proper locale codes
  const localeMap: Record<string, string> = {
    en: "en-US",
    "zh-CN": "zh-CN",
    ja: "ja-JP",
  };

  const formattedLocale = localeMap[targetLocale] || targetLocale;

  return new Intl.DateTimeFormat(formattedLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: targetTimezone,
  }).format(date);
}

/**
 * Format date for simple display (date only, no time) with timezone awareness
 */
export function formatDateSimple(
  dateString: string,
  locale?: string,
  timezone?: string
): string {
  const date = new Date(dateString);

  const targetLocale = locale || "en-US";
  const targetTimezone = timezone || getUserTimezone();

  const localeMap: Record<string, string> = {
    en: "en-US",
    "zh-CN": "zh-CN",
    ja: "ja-JP",
  };

  const formattedLocale = localeMap[targetLocale] || targetLocale;

  return new Intl.DateTimeFormat(formattedLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: targetTimezone,
  }).format(date);
}

/**
 * Hook to get locale and timezone-aware date formatting functions
 */
export function useDateFormat() {
  const locale = useLocale();
  const timezone = getUserTimezone();

  return {
    formatDate: (dateString: string) =>
      formatDate(dateString, locale, timezone),
    formatDateSimple: (dateString: string) =>
      formatDateSimple(dateString, locale, timezone),

    timezone,
  };
}
