/**
 * The machine's own settings: what belongs to this computer and never travels with the record, the theme ("A light or
 * dark theme, following the system") and the motion ("Motion can be switched off in the app"). Their shape, the
 * defaults, the check on reading, and what each button shows and switches to.
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

/**
 * "System", a fresh install's, follows the computer's reduced-motion setting until the motion switch is first clicked;
 * "on" (Animerat) and "off" (Stilla) hold one regardless
 */
export type Motion = 'system' | 'on' | 'off'

/** The motion in force: Animerat ('on') or Stilla ('off') */
export type ShownMotion = 'on' | 'off'

/** The settings file's shape */
export interface Settings {
  theme: Theme
  motion: Motion
  /** "Inte nu" on the prune line: the day it comes back, the first of next month ("Old history is pruned on request") */
  pruneLater?: string
  /** The profile on screen when the app last closed ("The app opens on the running profile, or the last one on screen") */
  onScreen?: string
}

/**
 * The settings in a settings file's text, each read apart, or its default when it is missing or unknown, or the file
 * cannot be read: a broken settings file only ever costs the theme and the motion, so it gives no message. Used once,
 * when the app starts: readSettings('{"theme":"dark"}') is { theme: 'dark', motion: 'system' }
 */
export function readSettings(text: string | null): Settings {
  if (text === null) return { ...DEFAULTS }
  try {
    const parsed = JSON.parse(text) as {
      theme?: unknown
      motion?: unknown
      pruneLater?: unknown
      onScreen?: unknown
    } | null
    const later = parsed?.pruneLater
    const kept = parsed?.onScreen
    return {
      theme: isTheme(parsed?.theme) ? parsed.theme : DEFAULTS.theme,
      motion: isMotion(parsed?.motion) ? parsed.motion : DEFAULTS.motion,
      ...(typeof later === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(later) ? { pruneLater: later } : {}),
      ...(typeof kept === 'string' && kept !== '' ? { onScreen: kept } : {}),
    }
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

/**
 * The motion in force: Stilla while the motion is "System" and the computer asks for reduced motion, else the one
 * chosen. Used by the app's state and by `nextMotion`: shownMotion('system', true) is 'off'
 */
export function shownMotion(motion: Motion, systemStill: boolean): ShownMotion {
  if (motion === 'system') return systemStill ? 'off' : 'on'
  return motion
}

/**
 * The motion after a click on the motion switch: the other of the one in force. Used by each click on it:
 * nextMotion('system', true) is 'on'
 */
export function nextMotion(motion: Motion, systemStill: boolean): ShownMotion {
  return shownMotion(motion, systemStill) === 'on' ? 'off' : 'on'
}

/** The motion's name as the switch's label shows it: motionName('off') is "Stilla" */
export function motionName(motion: ShownMotion): string {
  return MOTION_NAMES[motion]
}

// ======================================
//               Helpers
// ======================================

/** The themes a settings file can hold */
const THEMES: Theme[] = ['system', 'light', 'dark']

const NAMES: Record<ShownTheme, string> = { light: 'Ljust', dark: 'Mörkt' }

/** The motions a settings file can hold */
const MOTIONS: Motion[] = ['system', 'on', 'off']

const MOTION_NAMES: Record<ShownMotion, string> = { on: 'Animerat', off: 'Stilla' }

/** The settings when there is no file, or it cannot be read */
const DEFAULTS: Settings = { theme: 'system', motion: 'system' }

/** Whether a value read from the file is a theme the app knows. Used by `readSettings` */
function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme)
}

/** Whether a value read from the file is a motion the app knows. Used by `readSettings` */
function isMotion(value: unknown): value is Motion {
  return MOTIONS.includes(value as Motion)
}
