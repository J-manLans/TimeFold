# Code: the look, its scales

How the look's values are written: the shared scales each part picks from, the colours, and a part's own values. Each
decision follows the template in `../../README.md`, and is cited by its title.

## The look is a few scales, picked in each part (2026-11-28)

**Built by:** Handover, the look's scales.

**Decision:** the look's shared values are design tokens, CSS custom properties in one file,
`src/styles/design-tokens.css`, which `src/main.ts` imports once, beside `src/styles/base.css` (the reset, the fonts,
the body and the shared looks). The file holds the scales, the colours, and the few values several parts must keep alike
or the code reads. Every other value lives in the style block of the part that uses it.

- **Scales, picked in each part:** room (every padding, margin and gap), corners, text sizes, weights, letter-spacing
  and line height are scales of a few steps. A part's style block picks a step directly (`padding: var(--spacing-md)`),
  so a part is tuned by opening it and changing its step, and the whole look by changing a step in the file.
  - Room is steps of one base, `--spacing` (4px), named as clothes sizes: `--spacing-xxs` (2px), `-xs` (4), `-sm` (6),
    `-md` (8), `-lg` (12), `-xl` (16), `-xxl` (24). A step is added at either end, such as `-xxxl`, when a part needs
    one.
  - Corners: `--radius-sm` (4px), `-md` (6), `-lg` (12), and `--radius-full` for discs and pills.
  - Text: the type sets for all text ("Shared looks are written once"), and for the figures and the big buttons three
    display sizes, `--text-size-display-sm` (26px, the profile letter), `-md` (36, "Starta jobb", the wheel's hours) and
    `-lg` (46, the balance). Weights `--font-weight-normal` to `-bold`; letter-spacing `--tracking-wide` (0.025em),
    `-wider` (0.05em, the controls side) and `-widest` (0.1em, caps); line height `--leading-none` (1) and
    `--leading-normal` (1.5).
  - The names follow Tailwind's where it has them (corners, weights, tracking, line height); room takes clothes sizes,
    which read as the owner tunes ("md to sm"). Only the names: the CSS stays hand-written ("Svelte with TypeScript for
    the interface").
- **A part's own values:** a value one part needs and no step fits, such as a figure's size, a button's width or a time,
  is written raw where it is used, with a short comment saying what it is. Used more than once in that part, it is a
  local custom property declared once at the top of the part's outermost rule (`.calendar { --cell: 30px; }`), named for
  what it is there. An outlier that fixes one thing, such as a 1px margin, is written as it is. Borders are 1px.
- **Shared values** stay in the file: one several parts keep alike, such as the start button's height its choices scale
  from, and one the code reads with `getPropertyValue` (the stacking room, the dashboard's width, the undo's time, the
  pie's shares, the onboarding's timings).
- **Only taste is a value.** Before a value is written, ask whether it can follow from what it sizes or sits beside; if
  it can, it is worked out from that, never written as a number. The sides stack when the button block with its room no
  longer fits beside the dashboard, not below 640 px; a dropdown is as wide as its widest choice, not 17 characters.
- **Colours are named by intent:** by surface and role, `--controls-background`, `--dashboard-text`, never
  `--dark-grey`, since they change with the theme and the surface. Every colour is in the file, used once or not, so the
  themes are tuned in one place. A colour shared by several parts is one token; two that happen to be equal but mean
  different things are two.
- **Order:** the file opens with the scales, then runs Global, Controls (the controls side), Dashboard, then Overlays
  and popups, the popups grouped by the side that owns them. Inside each, values go in this order: colours, typography,
  dimensions, motion, shadows and effects. The sections use the banners of "Code style".
- **Theming:** `:root` sets `color-scheme: light dark`. A fresh install leaves it so, following the system; once the
  theme button is clicked, "Ljust" and "Mörkt" set it to `light` or `dark` ("A light or dark theme, following the
  system"). A value that differs between the themes is written once as `light-dark(light, dark)`; one that does not is a
  single value. While the look is tuned, a pair may hold the same value on both sides; once the design settles, such a
  pair is merged into one value. The profiles' colours are not tokens: the colour roles in "Code style" work them out.
  The balance profile's greys are tokens.
- **Motion:** times are written in seconds. `--speed-ui: 0.2s` is every small transition's ("The look: a fresh display
  face, mono text and soft buttons"); a longer animation that tells something has its own time, in its part, or in the
  file when the code reads it, such as the peek's 0.3s ("The ceiling wheel"). The app's own Animerat or Stilla decides,
  following the system's reduced-motion setting until the switch is first clicked ("Motion can be switched off in the
  app").

**Why:** a few steps worn everywhere make the look one system: the same distance means the same thing on every screen,
and one step changed moves everything that wears it. The owner tunes by looking at a part: its style block shows the
step it wears, so the change is made there, not in a token named for that part in another file. A value only one part
needs reads best beside the rule that uses it. Custom properties inherit through Svelte's scoped styles, so one import
on `:root` reaches every component with no wiring. Colours stay together because the themes are tuned as pairs:
`light-dark()` keeps a theme's pair on one line with no second set of tokens, and the theme button is one property on
one element.

**Rejected:** every value of the look in the file, each part with a token of its own (`--edit-bar-radius`), holding a
number or pointing at a shared one: about two hundred names, most used once, ninety of them for six or seven distances,
and tuning a part meant finding its tokens in a second file. Forcing every value onto a step: a figure's size or a
pointer's offset is chosen for that one thing, and a step would only round it. Room named by Tailwind's numbers
(`--spacing-2`): clothes sizes read as the owner thinks. Steps named by their pixels (`--space-8`): the name lies once
the base changes. The scales in rem: rem follows a reader's text size in a browser, which a window app has none of, and
the whole app grows or shrinks by the webview's zoom ("The app is zoomed as a whole"), which scales px too. Every colour
paired for both themes from the start: a pair says the themes differ, and an identical pair says it falsely. Times in
milliseconds: the owner reads seconds.

**Revisit if:** a value written raw in two parts that should match drifts apart: it moves to the file.
