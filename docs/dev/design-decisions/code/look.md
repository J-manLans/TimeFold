# Code: the look

How the look is written: its values as tokens, and the looks parts share. Each decision follows the template in
`../README.md`, and is cited by its title.

## Design tokens hold every value of the look (2026-11-15)

**Decision:** a design token is a named value standing for a design decision, written as a CSS custom property. Every
raw value of the look (colour, font, size, spacing, radius, time, shadow) is a token in one file,
`src/styles/design-tokens.css`, which `src/main.ts` imports once, beside `src/styles/base.css` (the reset, the fonts and
the body). Components never import it and use only `var(--…)`. Styles (selectors, layout, states) stay in each
component, except the looks several parts share, written once ("Shared looks are written once"); the values are all
central.

- **Names** say the intent, not the value: `--color-background`, `--wheel-diameter`, `--speed-ui`, never `--dark-grey`
  or `--size-200`. A value only one component uses is still a token, under that component. A decision shared by several
  parts is one token; two values that happen to be equal but mean different things are two. Where parts play the same
  role, such as small text or a heading in capitals, each part's token points at the role's shared one
  (`--entry-tag-size: var(--text-size-label)`), so one knob moves them all and a part can still be tuned apart.
- **Order:** the file runs Global, Controls (the controls side), Dashboard, then Overlays and popups, the popups grouped
  by the side that owns them, or Global. Inside each component, and in Global, values go in this order: colours,
  typography, dimensions, spacing, radii, motion, shadows and effects. The sections use the banners of "Code style".
- **Theming:** `:root` sets `color-scheme: light dark`. A fresh install leaves it so, following the system; once the
  theme button is clicked, "Ljust" and "Mörkt" set it to `light` or `dark` ("A light or dark theme, following the
  system"). A value that differs between the themes is written once as `light-dark(light, dark)`; one that does not is a
  single value. While the look is tuned, a pair may hold the same value on both sides; once the design settles, such a
  pair is merged into one value. The profiles' colours are not tokens: the colour roles in "Code style" work them out.
  The balance profile's greys are tokens.
- **Motion:** times are written in seconds. `--speed-ui: 0.2s` is every small transition's ("The look: a fresh display
  face, mono text and soft buttons"); a longer animation that tells something has its own token, such as the peek's 0.3s
  ("The ceiling wheel"). The app's own Animerat or Stilla decides, following the system's reduced-motion setting until
  the switch is first clicked ("Motion can be switched off in the app").

**Why:** one file is the tuning panel for the whole look, as the prototype's knobs were, and the look is tuned far more
often than a component is read; a token's name and go-to-definition make the second file cheap. Custom properties
inherit through Svelte's scoped styles, so one import on `:root` reaches every component with no wiring. Names by intent
survive a change of value. `light-dark()` keeps a theme's pair on one line with no second set of tokens, and the theme
button is one property on one element. Tokens describe the design as it is, not hypothetical needs.

**Rejected:** a component's own values in its style block: tuning the look would mean opening every component, and each
value would need a call on shared or local. Every colour paired for both themes from the start: a pair says the themes
differ, and an identical pair says it falsely. Times in milliseconds: the owner reads seconds.

**Revisit if:** the file grows past what is comfortable to tune in one place.

## Shared looks are written once (2026-11-27)

**Built by:** Phase 5, the shared looks: the fields' shared behaviour, the dropdowns as one, and the popups' frame.

**Decision:** a look more than one part of the screen wears is written once and worn, never copied into each component.
It takes one of three forms, by what it brings:

- **A class** in `src/styles/base.css` for a look alone: `.plastic`, the flat button; `.tag`; `.button-small`, with
  `.main` for the filled main choice ("Spara") and `.mini` in the label's size ("Rensa", "Inte nu"); and `.caps`, a
  heading in capitals.
- **An attachment** (`{@attach}`) for behaviour put on any element, such as `durationShape` on every length field.
- **A component** when look, markup and behaviour come together: `Disc`, `ChoiceButton`, `TipLabel`, the fields and the
  popups' frame.

- **Type sets:** all text outside the figures wears one of four sets: heading (15px, weight 600), body (13px), label
  (11px), and caps: the label's size in capitals, at 0.1em tracking and the surface's weight, in the surface's muted
  colour. A part's size token points at its set's (`--entry-tag-size: var(--text-size-label)`); no part has a text size
  of its own. Display type (the start button, the balance, the wheel, the profile letter, the onboarding's name) keeps
  its own sizes until the figures' own pass.
- **Units say what follows what:** `rem` for the three set sizes alone, from `html { font-size: 100% }`, written as the
  pixel value over 16 (`calc(13rem / 16)`), so the root is one knob for all text; `em` for what belongs to its text
  (tracking, a tag's or a small button's padding, gaps inside a line of text) and for the whole inside of a part built
  to come in sizes; `px` for everything else: borders, radii, panels, the gaps between parts and layout. A `px` value
  says it does not scale.
- **Fields:** a boxed field (`.field`) is see-through, edged in the surface's button line, at the small radius and the
  body set, with a small button's padding, so one swaps for the other in place. A field in a tag's place wears the tag
  alone, unfilled. A field opens at the size of the button or tag it replaces and keeps it while typed in: a tag and
  "Lägg till paus" are measured as they open, and in the menu every "Ändra", the colour's too, "Ny profil" and their
  fields share one size. A field's text is centred, where the button's or tag's words stood, at normal letter-spacing,
  so a field's characters are exactly 1ch each. The colour's hex code, always seven characters, gets 9ch of room. The
  menu's size is wide enough for a name; "Ny profil"'s field has no placeholder, only the caret. Every field shows its
  focus as its edge in the colour of where the profile on screen stands, in place of the ring. "Annan orsak"'s underline
  and the onboarding's lone fields keep their own look.
- **Dropdowns:** a field you choose into, a closed control that opens a list to choose from ("Välj orsak", the edit's
  profile picker), carries a chevron after its text, in its text's colour, which points up while its list is open. Every
  dropdown is the app's own, one look written once: the closed field, then its list of plain lines, the hovered one
  filled and the chosen one greyed, which grows open and then fades its lines in, and closes on Esc, its field keeping
  the focus, or on a click outside it, as a field drops. A list either unfolds, growing in place and pushing what is
  under it down, or floats, lying over what is under it right under the field, on the popups' frame; each place is
  judged by eye. The reasons unfold at the edit popup's foot; the profile picker's list floats from its head, the
  profile in colour greyed in it and a running one greyed with "· pågår". What a list holds beyond choices, as the
  reasons' pen, rename and "Annan orsak", is that dropdown's own, on top of the shared look.
- **No scrollbars:** no scrollbar shows anywhere; a part that can overflow scrolls without one. A bar takes width from
  what it scrolls, and its coming and going made the dashboard's rows re-flow back and forth as the window was resized.
- **Surfaces:** each surface (the controls side, the dashboard, the menu, a popup) names itself with `data-surface` on
  its root, and `base.css` gives each the same five variables from its tokens: `--surface-background`, `--surface-text`,
  `--surface-muted`, `--surface-line` and `--surface-button-line`. A shared look reads only these, so it fits wherever
  it sits. What can be clicked has the stronger button line; a surface with none of its own uses its line.

**Why:** a look copied into each part drifts, and aligning one to another took several tries: the tag was three copies,
the small button five, identical. Nine text sizes half a pixel apart were not decisions, and three read better side by
side. A unit tells the reader what moves when something else changes. Surface names let one class fit the dashboard, the
frost and a popup without a variant for each.

**Rejected:** each component styling its own copy: see Why. A field sized to its content (`field-sizing`): it jumps as a
tag opens, and the Linux webview may not support it. "Ändra" sized to its value: it changes size from one setting to the
next. A field's own fill, and a ring around a field: the owner tried both against the edge and kept the edge. `em` for
panels and layout: a panel's padding would change with the set its text wears, and nesting compounds. The root at 62.5%:
every text with no size of its own starts at 10px. Caps a size below the label: the owner likes them alike, and it saves
a style. A weight of its own on a caps heading. A class per surface (`.tag-menu`): the surface's variables do it once.
The native `<select>`'s list: the system paints it, brownish beside the app's colours on Linux and otherwise on Windows,
and CSS cannot reach it. The profile picker's list unfolding: the owner tried both in the prototype, and floating looked
best. A rule for which places float: there are two, each judged by eye, and a reason found after the choice only dressed
it up.

**Revisit if:** a part needs a size between two sets more than once, or a surface needs a sixth variable.

**Cases:** the root at 125% grows every text, tag and small button, while panels, gaps and borders hold; a tag in the
menu wears the menu's line, one in the edit popup the dashboard's; "Ändra" and the edit's "Avbryt" differ only in their
surface's colours; every caps heading is 11px at 0.1em, in its surface's muted colour; "Välj orsak" and the edit's
profile picker show the same chevron, each pointing up while its list is open; in a gap, picking another profile fills
it and picking the entry's own empties it again. "25 %", "paus 30m" and "Lägg till paus" each open into a field of
exactly their size; "Ändra" under a name and under a salary are the same width, and each field takes its place without
moving anything.
