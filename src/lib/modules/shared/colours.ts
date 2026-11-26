/**
 * The colour rule: a profile's colours worked out from its hue ("Each profile carries its colours"), carried over
 * from the prototype, whose colours are the truth. Components take colours by role and never pick one.
 * Hues are OKLCH hues, 0–359; colours are written #rrggbb.
 */

import { type Profile } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/** The balance profile's hue at a fresh start, an OKLCH hue: a cyan */
export const FIRST_HUE = 195

/** A profile's colours by role, as components use them */
export interface ColourRoles {
  /** The profile's own colour: hours used, the flex bar's minus */
  base: string
  /** The base faded toward the panel: the unused part of a figure */
  dimmed: string
  /** The hot accent: the start ring, the status mark, the undo's afterglow, a plus balance, the letter past its line */
  neon: string
}

/**
 * A profile's base: its hue muted, 55% of the chroma of the hue at its most vivid, at a lightness 40% of the way from
 * that colour's own toward 0.70. Used for every profile's base: baseColour(195) is #7ed6d5.
 */
export function baseColour(hue: number): string {
  const lightness = mostVividLightness(hue)
  const toward = lightness + (MUTE.middle - lightness) * MUTE.pull
  return rgbToHex(lchToRgb([toward, maxChroma(lightness, hue) * MUTE.keep, hue]))
}

/**
 * The neon: the hue opposite, at the lightness where it is most vivid, with all the chroma sRGB allows there.
 * It moves only with the hue. Used for every profile's accent: neonColour(195) is #fc0055.
 */
export function neonColour(hue: number): string {
  const opposite = (hue + 180) % 360
  const lightness = mostVividLightness(opposite)
  return rgbToHex(lchToRgb([lightness, maxChroma(lightness, opposite), opposite]))
}

/**
 * The OKLCH hue of the colour at a place on the picker's hue strip, 0–359 as the strip runs red, yellow, green, cyan,
 * blue, magenta. Used by the colour picker to turn where the strip sits into a profile's hue: hueOfStrip(0) is red's.
 */
export function hueOfStrip(strip: number): number {
  return labToLch(rgbToOklab(hsvToRgb(strip)))[2]
}

/**
 * Where an OKLCH hue sits on the picker's hue strip: the HSV hue of that hue at its most vivid. Used to open the picker
 * where the profile's hue is, the inverse of `hueOfStrip` to within a degree.
 * @returns 0 to under 360
 */
export function stripOfHue(hue: number): number {
  const lightness = mostVividLightness(hue)
  const [r, g, b] = lchToRgb([lightness, maxChroma(lightness, hue), hue])
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const spread = max - min
  if (spread === 0) return 0
  const sixth = max === r ? (g - b) / spread : max === g ? (b - r) / spread + 2 : (r - g) / spread + 4
  return (sixth * 60 + 360) % 360
}

/**
 * A new profile's hue: the middle of the largest gap between the hues in use, each profile using two, its own and the
 * opposite one its neon has ("Each profile carries its colours"). Used by "Ny profil": beside a hue of 195 alone, 105
 * or 285.
 * @param random - picks between gaps equal to the half degree, 0 to under 1
 * @returns a whole degree, 0–359; FIRST_HUE with no hues in use
 */
export function largestGapHue(hues: number[], random: () => number = Math.random): number {
  if (hues.length === 0) return FIRST_HUE
  const all = hues.flatMap((h) => [h, (h + 180) % 360]).sort((a, b) => a - b)
  let best: number[] = []
  let bestGap = -1
  all.forEach((a, i) => {
    const b = i + 1 < all.length ? all[i + 1] : all[0] + 360
    const gap = b - a
    if (gap > bestGap + 0.5) {
      best = [a + gap / 2]
      bestGap = gap
    } else if (Math.abs(gap - bestGap) <= 0.5) best.push(a + gap / 2)
  })
  return Math.round(best[Math.floor(random() * best.length)]) % 360
}

/**
 * The base faded toward the panel: mixed 70% toward it in OKLab, or, when that leaves it within 0.15 lightness of the
 * base, 0.15 past the panel on the side away from the base, at 30% of the base's colour. Used for the unused part of
 * a figure: dimmed('#7ed6d5', '#0d1014') is #2c4346.
 */
export function dimmed(base: string, panel: string): string {
  const a = rgbToOklab(hexToRgb(base))
  const b = rgbToOklab(hexToRgb(panel))
  const t = DIM.mix
  let mixed: Lab = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
  if (Math.abs(mixed[0] - a[0]) < DIM.gap) {
    const away = b[0] > a[0] ? 1 : b[0] < a[0] ? -1 : b[0] < 0.5 ? 1 : -1
    const lightness = b[0] + away * DIM.gap
    if (lightness >= 0.05 && lightness <= 0.98 && Math.abs(lightness - a[0]) >= DIM.gap) {
      mixed = [lightness, a[1] * (1 - t), a[2] * (1 - t)]
    }
  }
  return rgbToHex(oklabToLinearRgb(mixed).map((v) => fromLinear(clamp(v))) as Rgb)
}

/**
 * A colour faded: the same hue, with 45% of its chroma taken away and its lightness moved 20% of the way toward the
 * panel's, in OKLCH ("The ceiling wheel"). Used for the wheel's pieces worked by the other profiles: faded('#7368d4',
 * '#0d1014') is #5e5b93.
 */
export function faded(colour: string, panel: string): string {
  const [lightness, chroma, hue] = labToLch(rgbToOklab(hexToRgb(colour)))
  const toward = rgbToOklab(hexToRgb(panel))[0]
  return rgbToHex(lchToRgb([lightness + (toward - lightness) * FADE.lightness, chroma * (1 - FADE.chroma), hue]))
}

/**
 * A profile's colours by role, against the panel they sit on ("Code style": colours by role). Used by every
 * component that shows a profile's colour: the letter and the start ring take `neon`.
 */
export function colourRoles(profile: Profile, panel: string): ColourRoles {
  return { base: profile.base, dimmed: dimmed(profile.base, panel), neon: neonColour(profile.hue) }
}

/** The least contrast black must reach on a colour to be written on it (WCAG AA for text) */
const INK_CONTRAST = 4.5

/**
 * Black or white, whichever reads on a colour: black while it reaches 4.5:1 there (WCAG: luminance from linear RGB,
 * then (lighter + 0.05) / (darker + 0.05)), white otherwise, which is then about 4.6:1 or better. Used by the pill's
 * − and + on a profile's neon: on #3d5afe white, on #00e4fd black.
 */
export function inkOn(colour: string): '#000000' | '#ffffff' {
  const [r, g, b] = hexToRgb(colour).map(toLinear)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return (luminance + 0.05) / 0.05 >= INK_CONTRAST ? '#000000' : '#ffffff'
}

// ======================================
//               Helpers
// ======================================

type Rgb = [number, number, number]
type Lab = [number, number, number]
type Lch = [number, number, number]

/** The muted base's numbers, from the prototype's NEON */
const MUTE = { keep: 0.55, pull: 0.4, middle: 0.7 }

/** The dimmed colour's numbers, from the prototype's RULE */
const DIM = { mix: 0.7, gap: 0.15 }

/** The faded colour's numbers, from the prototype's WHEEL: the share of chroma taken away, and of the way toward the panel */
const FADE = { chroma: 0.45, lightness: 0.2 }

// === Colour spaces, as in the prototype ===

/** An sRGB channel made linear. Used by `rgbToOklab` */
function toLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/** A linear channel back to sRGB. Used wherever a colour is written out */
function fromLinear(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

/** sRGB (0–1) to OKLab. Used to mix and measure colours */
function rgbToOklab(rgb: Rgb): Lab {
  const [r, g, b] = rgb.map(toLinear)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

/** OKLab to linear sRGB, which may fall outside 0–1. Used to test the gamut and to write colours out */
function oklabToLinearRgb(lab: Lab): Rgb {
  const l = (lab[0] + 0.3963377774 * lab[1] + 0.2158037573 * lab[2]) ** 3
  const m = (lab[0] - 0.1055613458 * lab[1] - 0.0638541728 * lab[2]) ** 3
  const s = (lab[0] - 0.0894841775 * lab[1] - 1.291485548 * lab[2]) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

/** OKLCH to OKLab. Used for every colour built from a hue */
function lchToLab([l, c, h]: Lch): Lab {
  const angle = (h * Math.PI) / 180
  return [l, c * Math.cos(angle), c * Math.sin(angle)]
}

/** OKLab to OKLCH. Used by `hueOfStrip` for the hue, and by `faded` */
function labToLch([l, a, b]: Lab): Lch {
  return [l, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360]
}

/** The most chroma sRGB allows at a lightness and hue, found by halving. Used for every vivid colour */
function maxChroma(lightness: number, hue: number): number {
  let low = 0
  let high = 0.4
  for (let i = 0; i < 24; i++) {
    const middle = (low + high) / 2
    if (inGamut(oklabToLinearRgb(lchToLab([lightness, middle, hue])))) low = middle
    else high = middle
  }
  return low
}

/** The lightness, between 0.2 and 0.98, where a hue is most vivid. Used for the base and the neon */
function mostVividLightness(hue: number): number {
  let best = 0.5
  let bestChroma = -1
  for (let lightness = 0.2; lightness < 0.985; lightness += 0.01) {
    const chroma = maxChroma(lightness, hue)
    if (chroma > bestChroma) {
      bestChroma = chroma
      best = lightness
    }
  }
  return best
}

/** OKLCH to sRGB, the chroma cut to what sRGB allows. Used by `baseColour` and `neonColour` */
function lchToRgb([l, c, h]: Lch): Rgb {
  const lightness = clamp(l)
  const chroma = Math.min(c, maxChroma(lightness, h))
  return oklabToLinearRgb(lchToLab([lightness, chroma, h])).map((v) => fromLinear(clamp(v))) as Rgb
}

/** The picker strip's colour at full saturation and value. Used by `hueOfStrip` */
function hsvToRgb(hue: number): Rgb {
  const f = (n: number): number => {
    const k = (n + hue / 60) % 6
    return 1 - Math.max(0, Math.min(k, 4 - k, 1))
  }
  return [f(5), f(3), f(1)]
}

// === Small helpers ===

/** Whether a linear colour lies within sRGB, with the prototype's small tolerance. Used by `maxChroma` */
function inGamut(rgb: Rgb): boolean {
  return rgb.every((v) => v >= -0.0005 && v <= 1.0005)
}

/** A number kept within 0–1. Used wherever a colour is written out */
function clamp(v: number): number {
  return Math.min(1, Math.max(0, v))
}

/** #rrggbb to sRGB (0–1). Used to read bases and panels */
function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

/** sRGB (0–1) to #rrggbb. Used wherever a colour is written out */
function rgbToHex(rgb: Rgb): string {
  return `#${rgb
    .map((v) =>
      Math.round(v * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}
