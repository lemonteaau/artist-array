export const locales = ["en", "zh-CN", "ja"] as const;

export const defaultLocale = "en";

export type Locale = (typeof locales)[number];
