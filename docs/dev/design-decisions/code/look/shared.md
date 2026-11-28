# Code: the look, its shared looks

The looks several parts wear, each written once: classes, attachments and components, the type sets, the fields, the
dropdowns and the surfaces. Each decision follows the template in `../../README.md`, and is cited by its title.

## Shared looks are written once (2026-11-27)

**Built by:** Phase 5, the shared looks: the popups' frame.

**Decision:** a look more than one part of the screen wears is written once and worn, never copied into each component.
It takes one of three forms, by what it brings:

- **A class** in `src/styles/base.css` for a look alone: `.plastic`, the flat button; `.tag`; `.button-small`, with
  `.main` for the filled main choice ("Spara") and `.mini` in the label's size ("Rensa", "Inte nu"); and `.caps`, a
  heading in capitals.
- **An attachment** (`{@attach}`) for behaviour put on any element, such as `durationShape` on every length field, and
  the fields' one behaviour on the plain input: it opens with the focus in and the text selected, at the size of what it
  replaces, keeps on Enter, drops on Esc, the focus back on what it replaced, and when left, a press elsewhere or the
  focus moving on inside the app, drops too, as a click away does everywhere ("Entering a length of time"). Switching
  windows leaves it open. It calls back to keep or drop; what surrounds each field (a reading, a note, a refusal and its
  red) stays in its component's own markup. A value with steps, as a locked value's field and then its date, keeps its
  own keys across them.
- **A component** when look, markup and behaviour come together: `Disc`, `ChoiceButton`, `TipLabel`, the dropdown and
  the popups' frame.

- **Type sets:** all text outside the figures wears one of four sets: heading, body, label, and caps: the label's size
  in capitals, at the widest tracking and the surface's weight, in the surface's muted colour. A part uses its set's
  size directly (`font-size: var(--text-size-label)`); no part has a text size of its own. Display type (the start
  button, the balance, the wheel, the profile letter, the onboarding's name) wears the display sizes; the figures' small
  labels wear the label set.
- **Units:** `px` for every value of the look: the scales, the type sets, borders, figures and layout. `em` only for
  letter-spacing, and for the whole inside of a part built to come in sizes, so it follows its own text. A tag's or a
  small button's padding is a spacing step like any other room. The whole app grows or shrinks by the webview's zoom
  ("The app is zoomed as a whole"), which scales `px`.
- **Fields:** a boxed field (`.field`) is see-through, edged in the surface's button line, at `--radius-md` and the body
  set, with a small button's padding, so one swaps for the other in place. A field in a tag's place wears the tag alone,
  unfilled. A field opens at the size of the button or tag it replaces and keeps it while typed in: a tag and "Lägg till
  paus" are measured as they open, and in the menu every "Ändra", the colour's too, "Ny profil" and their fields share
  one size. A field's text is centred, where the button's or tag's words stood, at normal letter-spacing, so a field's
  characters are exactly 1ch each. The colour's hex code, always seven characters, gets 9ch of room. The menu's size is
  wide enough for a name; "Ny profil"'s field has no placeholder, only the caret. Every field shows its focus as its
  edge in the colour of where the profile on screen stands, in place of the ring. "Annan orsak"'s underline and the
  onboarding's lone fields keep their own look.
- **Dropdowns:** a field you choose into, a closed control that opens a list to choose from ("Välj orsak", the edit's
  profile picker), carries a chevron after its text, in its text's colour, which points up while its list is open. Every
  dropdown is the app's own, one look written once: the closed field, as wide as its widest choice and never wider than
  its room, as a native select is, so it never changes width as a choice is made; then its list of plain lines, from the
  left, the hovered one filled and the chosen one greyed. Anything longer than its room, a typed reason in the closed
  field or a long reason in the list, is cut with "…" on one line, never wrapped. The list grows open and then fades its
  lines in, and closes on Esc, its field keeping the focus, or on a click outside it, as a field drops. A list either
  unfolds, growing in place and pushing what is under it down, or floats, lying over what is under it right under the
  field, on the popups' frame; each place is judged by eye. The reasons unfold at the edit popup's foot; the profile
  picker's list floats from its head, the profile in colour greyed in it and a running one greyed with "· pågår". What a
  list holds beyond choices, as the reasons' pen, rename and "Annan orsak", is that dropdown's own, on top of the shared
  look; "Annan orsak" at rest is cut at the longest reason's length.
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
panels and layout: a panel's padding would change with the set its text wears, and nesting compounds. Caps a size below
the label: the owner likes them alike, and it saves a style. A weight of its own on a caps heading. A `Field` component
rendering the input: what surrounds each field differs too much, so every difference would become a prop or a snippet. A
class per surface (`.tag-menu`): the surface's variables do it once. The native `<select>`'s list: the system paints it,
brownish beside the app's colours on Linux and otherwise on Windows, and CSS cannot reach it. The profile picker's list
unfolding: the owner tried both in the prototype, and floating looked best. A rule for which places float: there are
two, each judged by eye, and a reason found after the choice only dressed it up. A closed field as wide as its chosen
text, cut at a hand-set 17 characters: it changed width as a choice was made, and a reason renamed or added longer was
cut though it was a choice.

**Revisit if:** a part needs a size between two sets more than once, or a surface needs a sixth variable.

**Cases:** a tag in the menu wears the menu's line, one in the edit popup the dashboard's; "Ändra" and the edit's
"Avbryt" differ only in their surface's colours; every caps heading is the label's size at the widest tracking, in its
surface's muted colour; "Välj orsak" and the edit's profile picker show the same chevron, each pointing up while its
list is open; "Välj orsak" sits in a field already as wide as "Glömde stämpla ut", and choosing it changes nothing in
width; a reason renamed longer widens the field, up to the popup's room, past which it is cut; in a gap, picking another
profile fills it and picking the entry's own empties it again. "25 %", "paus 30m" and "Lägg till paus" each open into a
field of exactly their size; "Ändra" under a name and under a salary are the same width, and each field takes its place
without moving anything.
