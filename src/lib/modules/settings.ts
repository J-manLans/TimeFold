/**
 * The machine's own settings: what belongs to this computer and never travels with the record, such as the theme ("A
 * light or dark theme, following the system"). Their shape, the defaults, and the check on reading.
 */

// ======================================
//                 API
// ======================================

/** "System" follows the computer's light or dark mode; "light" and "dark" hold one regardless */
export type Theme = 'system' | 'light' | 'dark'

/** The settings file's shape */
export interface Settings {
  theme: Theme
}

/**
 * The settings in a settings file's text, or the defaults when there is no file or it cannot be read: a broken
 * settings file only ever costs the theme, so it gives no message. Used once, when the app starts:
 * readSettings('{"theme":"dark"}') is { theme: 'dark' }
 */
export function readSettings(text: string | null): Settings {
  if (text === null) return { ...DEFAULTS }
  try {
    const parsed: unknown = JSON.parse(text)
    const theme = (parsed as { theme?: unknown } | null)?.theme
    return isTheme(theme) ? { theme } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

/** The theme after `theme` on the theme button: System → Ljust → Mörkt → System. Used by each click on it */
export function nextTheme(theme: Theme): Theme {
  return THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
}

/** The theme's name as the theme button's label shows it: themeName('light') is "Ljust" */
export function themeName(theme: Theme): string {
  return NAMES[theme]
}

// ======================================
//               Helpers
// ======================================

/** The themes in the theme button's order */
const THEMES: Theme[] = ['system', 'light', 'dark']

const NAMES: Record<Theme, string> = { system: 'System', light: 'Ljust', dark: 'Mörkt' }

/** The settings when there is no file, or it cannot be read */
const DEFAULTS: Settings = { theme: 'system' }

/** Whether a value read from the file is a theme the app knows. Used by `readSettings` */
function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme)
}
