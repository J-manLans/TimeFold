/**
 * The machine's own settings: what belongs to this computer and never travels with the record, such as the theme ("A
 * light or dark theme, following the system"). Their shape, the defaults, and the check on reading.
 */

// ======================================
//                 API
// ======================================

/**
 * "System", a fresh install's, follows the computer's light or dark mode until the theme button is first clicked;
 * "light" and "dark" hold one regardless
 */
export type Theme = 'system' | 'light' | 'dark'

/** The theme in force on screen: what "System" resolves to, or the theme chosen */
export type ShownTheme = 'light' | 'dark'

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

/**
 * The theme in force: the computer's while the theme is "System", else the one chosen. Used by the theme button's icon
 * and label, and by `nextTheme`: shownTheme('system', true) is 'dark'
 */
export function shownTheme(theme: Theme, systemDark: boolean): ShownTheme {
  if (theme === 'system') return systemDark ? 'dark' : 'light'
  return theme
}

/**
 * The theme after a click on the theme button: the other of the one in force, so the button only switches between
 * Ljust and Mörkt. Used by each click on it: nextTheme('system', true) is 'light'
 */
export function nextTheme(theme: Theme, systemDark: boolean): ShownTheme {
  return shownTheme(theme, systemDark) === 'dark' ? 'light' : 'dark'
}

/** The theme's name as the theme button's label shows it: themeName('light') is "Ljust" */
export function themeName(theme: ShownTheme): string {
  return NAMES[theme]
}

// ======================================
//               Helpers
// ======================================

/** The themes a settings file can hold */
const THEMES: Theme[] = ['system', 'light', 'dark']

const NAMES: Record<ShownTheme, string> = { light: 'Ljust', dark: 'Mörkt' }

/** The settings when there is no file, or it cannot be read */
const DEFAULTS: Settings = { theme: 'system' }

/** Whether a value read from the file is a theme the app knows. Used by `readSettings` */
function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme)
}
