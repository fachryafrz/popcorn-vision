import regionsData from "@/data/iso-3166.json";

interface RegionItem {
  name: string;
  "alpha-2": string;
}

const regions = regionsData as RegionItem[];

const codeToNameMap = new Map<string, string>(
  regions.map((r) => [r["alpha-2"].toUpperCase(), r.name]),
);

const nameToCodeMap = new Map<string, string>(
  regions.map((r) => [r.name.toLowerCase(), r["alpha-2"].toUpperCase()]),
);

const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  "Asia/Jakarta": "ID",
  "Asia/Pontianak": "ID",
  "Asia/Makassar": "ID",
  "Asia/Jayapura": "ID",
  "Asia/Singapore": "SG",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Kuching": "MY",
  "Asia/Bangkok": "TH",
  "Asia/Ho_Chi_Minh": "VN",
  "Asia/Saigon": "VN",
  "Asia/Manila": "PH",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "Asia/Taipei": "TW",
  "Asia/Hong_Kong": "HK",
  "Asia/Shanghai": "CN",
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Asia/Dubai": "AE",
  "Asia/Riyadh": "SA",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Australia/Brisbane": "AU",
  "Australia/Perth": "AU",
  "Pacific/Auckland": "NZ",
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE",
  "Europe/Zurich": "CH",
  "Europe/Vienna": "AT",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Helsinki": "FI",
  "Europe/Warsaw": "PL",
  "Europe/Lisbon": "PT",
  "Europe/Dublin": "IE",
  "Europe/Istanbul": "TR",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Phoenix": "US",
  "America/Anchorage": "US",
  "Pacific/Honolulu": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/Montreal": "CA",
  "America/Mexico_City": "MX",
  "America/Sao_Paulo": "BR",
  "America/Buenos_Aires": "AR",
  "America/Argentina/Buenos_Aires": "AR",
};

/**
 * Resolves an ISO 3166-1 alpha-2 code (e.g. "ID") to its canonical country name
 * in data/iso-3166.json.
 */
export function getCountryNameByCode(alpha2: string): string | null {
  const normalized = alpha2.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return null;
  return codeToNameMap.get(normalized) ?? null;
}

/**
 * Resolves either a canonical country name (e.g. "Indonesia") or an ISO alpha-2 code
 * (e.g. "ID") to an uppercase alpha-2 code, falling back to "US".
 */
export function resolveCountryCode(
  countryOrCode?: string | null,
  fallback: string = "US",
): string {
  const trimmed = countryOrCode?.trim();
  if (!trimmed) return fallback;
  if (/^[A-Za-z]{2}$/.test(trimmed)) {
    const upper = trimmed.toUpperCase();
    if (codeToNameMap.has(upper)) return upper;
  }
  return nameToCodeMap.get(trimmed.toLowerCase()) ?? fallback;
}

/**
 * Detects an ISO 3166-1 alpha-2 code from browser timezone or navigator.language.
 */
export function detectCountryCodeFromBrowser(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone && timeZone in TIMEZONE_TO_COUNTRY) {
      return TIMEZONE_TO_COUNTRY[timeZone];
    }
  } catch {
    // Ignore Intl errors in restricted environments
  }

  if (typeof navigator !== "undefined") {
    const locales = [
      ...(navigator.languages ?? []),
      navigator.language,
    ].filter(Boolean);

    for (const locale of locales) {
      const match = locale.match(/[-_]([A-Za-z]{2})\b/);
      if (match) {
        const code = match[1].toUpperCase();
        if (codeToNameMap.has(code)) {
          return code;
        }
      }
    }
  }

  return null;
}

/**
 * Detects the user's country via edge geo headers (/api/geo) first,
 * falling back to browser timezone/locale, and returns the canonical country name.
 */
export async function detectUserCountryName(): Promise<string | null> {
  try {
    const res = await fetch("/api/geo", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { countryCode?: unknown };
      if (typeof data.countryCode === "string") {
        const name = getCountryNameByCode(data.countryCode);
        if (name) return name;
      }
    }
  } catch {
    // Fall back to browser detection when /api/geo is unreachable
  }

  const browserCode = detectCountryCodeFromBrowser();
  if (!browserCode) return null;
  return getCountryNameByCode(browserCode);
}
