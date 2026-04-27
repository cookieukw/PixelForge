import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";

import { en, type Translation } from "./locales/en";
import { pt } from "./locales/pt";

// ─── Locale registry ──────────────────────────────────────────────────────────
// Add new locales here. Keys must be BCP-47 language tags (lowercase, no region).

const LOCALES: Record<string, Translation> = {
    en,
    pt,
};

export type LocaleCode = keyof typeof LOCALES;

// ─── Language detection ───────────────────────────────────────────────────────

function detectLocale(): LocaleCode {
    // navigator.language returns e.g. "pt-BR", "en-US", "en", "pt"
    const lang = (navigator.language ?? "en").toLowerCase();

    // Try exact match first (e.g. "pt"), then prefix (e.g. "pt" from "pt-BR")
    const exact = lang as LocaleCode;
    if (LOCALES[exact]) return exact;

    const prefix = lang.split("-")[0] as LocaleCode;
    if (LOCALES[prefix]) return prefix;

    // Unknown locale → fall back to English
    return "en";
}

// ─── Interpolation ────────────────────────────────────────────────────────────
// Replaces {key} placeholders in a string.
// e.g. interpolate("Speed: {value}s", { value: "1.0" }) → "Speed: 1.0s"

function interpolate(template: string, vars?: Record<string, string | number>): string {
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (_, key) =>
        vars[key] !== undefined ? String(vars[key]) : `{${key}}`
    );
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface I18nContextValue {
    locale: LocaleCode;
    setLocale: (locale: LocaleCode) => void;
    t: (key: string, vars?: Record<string, string | number>) => string;
    availableLocales: LocaleCode[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface I18nProviderProps {
    children: ReactNode;
    /** Override the initial locale (useful for testing). Defaults to auto-detect. */
    defaultLocale?: LocaleCode;
}

export function I18nProvider({ children, defaultLocale }: I18nProviderProps) {
    const [locale, setLocale] = useState<LocaleCode>(defaultLocale ?? detectLocale());

    // Resolve a dot-path key like "actions.exportGif" against the locale object,
    // falling back to English if the key is missing in the current locale.
    const t = useCallback(
        (key: string, vars?: Record<string, string | number>): string => {
            const parts = key.split(".");
            let node: unknown = LOCALES[locale];

            for (const part of parts) {
                if (typeof node !== "object" || node === null) {
                    node = undefined;
                    break;
                }
                node = (node as Record<string, unknown>)[part];
            }

            // Fall back to English if key is missing in current locale
            if (typeof node !== "string") {
                let fallback: unknown = en;
                for (const part of parts) {
                    if (typeof fallback !== "object" || fallback === null) {
                        fallback = undefined;
                        break;
                    }
                    fallback = (fallback as Record<string, unknown>)[part];
                }
                node = typeof fallback === "string" ? fallback : key;
            }

            return interpolate(node as string, vars);
        },
        [locale]
    );

    const value = useMemo<I18nContextValue>(
        () => ({
            locale,
            setLocale,
            t,
            availableLocales: Object.keys(LOCALES) as LocaleCode[],
        }),
        [locale, t]
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTranslation() {
    const ctx = useContext(I18nContext);
    if (!ctx) {
        throw new Error("useTranslation must be used inside <I18nProvider>");
    }
    return ctx;
}
