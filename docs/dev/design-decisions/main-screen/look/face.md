# Main screen: the look

Type, colour, surfaces and buttons. Each decision follows the template in `../../README.md`, and is cited by its title.

## The look: a fresh display face, mono text and soft buttons (2026-11-15)

**Decision:** the app's look, from the owner's art direction references (kept locally, not in git) and settled on the
prototype. Its values live in the code ("The look is a few scales, picked in each part").

- **Type:** Bricolage Grotesque, bold and at its narrowest width, for the big things: "Starta jobb", the profile letter,
  the balance and the hours inside the ceiling wheel. JetBrains Mono for all other text on both sides, in normal case;
  quiet lines and short messages after an action wear the label set in the muted colour. Both fonts are bundled from
  their `@fontsource-variable` npm packages, so the app needs no internet to show them.
- **Colour:** flat fields with one hot accent, which the neon already is. Each theme colour is set once, its light and
  dark value side by side. The dashboard is near-black in the dark theme and slate blue in the light, each a tinted
  family of panel, rows, lines and text ("The main screen has a controls side and a dashboard"). Contrast is balanced
  across the themes, a little stronger in the light one, where faint lines read weaker at the same ratio, and stronger
  still on its blue-tinted frost. Red means removal or a warning: time taken away on the entry line, "Ta bort" and
  "Rensa", and a break tag at its limit; there is no other warning colour. A button that removes is red text with no
  border; the first click adds a red border and a question mark ("Ta bort?", "Rensa?"), the second removes, and a click
  or the focus going elsewhere turns it back. It keeps room for its "?" from the start, so nothing beside it moves. A
  profile with red colours keeps them: removal and warnings are told by their place, not their hue.
- **Buttons:** flat, in the theme's button colour (in the light theme the dashboard's blue, a step deeper; in the dark a
  dark grey), with no border and no shading, small corners and one soft, quiet shadow down and to the right. Hovered, a
  little lighter; pressed, a faint shade from the top. The light theme's controls side is in cool greys, so it sits with
  the blue. The profile popup takes the button colour, the chosen or hovered profile a lighter step. No popup has a
  shadow: the dimmed layer behind each lifts it, and every popup is styled alike.
- **Profile circle:** a raised disc in the button's own colour, lit by a soft round glow toward its top, its letter in
  the colour of where the profile stands ("Each profile carries its colours"), trimmed to its capital so it sits dead
  centre, in a soft see-through dent, after a CodePen pen (bthehuman, MIT), so the dent is always a shade of the
  button's colour. In the light theme its highlights and shadows are tinted blue. The glow has one shape in both themes;
  only its colours change. The theme button's disc is in the buttons' colour too, with a light icon.
- **Motion:** every transition in the interface takes one short time, one setting for all. A text that changes swaps at
  once. Animations that tell something over longer, such as the numbers counting at stop or the undo's fade, keep their
  own length.
- **Light:** a soft, matte light follows the pointer over the controls side, one light shared by all buttons, reaching
  far enough to flow across them and near enough that a button visibly lights as the pointer enters it. It lies only on
  button surfaces, faint and tinted, fading in and out with the pointer. The discs catch it too, the profile disc a
  little less, so it stays a little apart; on the undo it lies over the afterglow, under the arrow. The light lies only
  on what can be clicked: while the menu is open, only on what is in the menu, and while a popup is open, nowhere. The
  menu's small text buttons stay plain: the light marks the main controls and the discs. A disabled button reacts to
  nothing, and every unavailable button fades by the same amount.
- **Ornament:** micro labels, registration marks and barcode strips only where they carry meaning.

**Why:** the owner likes the references' printed, technical feel, with something fresher and more modern for the big
type. A mono for the rest ties the controls to the dashboard. Flat buttons with one soft shadow keep the surfaces calm;
the indented disc gives the profile button a physical touch.

**Rejected:** a flat saturated colour field for the dashboard: the dark panel stays. Rounder condensed faces (Saira
Extra Condensed, Big Shoulders Display, Teko): too round. Tektur, condensed: square and technical, but not fresh enough
for the big type; tried for all text, it was too much. Matte plastic buttons with grain, edge highlights and a deeper
shadow: they looked like 1990s 3D. Shaded or glossy buttons. A white profile circle: the button's own colour reads
better. Decorative micro labels: they say nothing. Light grey buttons in the light theme: they barely stood off the
page; the blue ties the controls side to the dashboard. An outline around the profile letter: it looked silly. No light
on the discs: it set them apart, but less naturally; the profile disc's weaker share keeps a little of both. A fine
grain over the panels: tried, it added nothing. A near-white theme disc in the light theme: the blue one sits better
with the other buttons. A top-down gradient on the disc in the light theme, beside the glow in the dark: the glow looks
better, and one shape keeps the theme a matter of colours. Loading the fonts from Google Fonts: the app works offline. A
changing text fading out, swapping and fading back in: the owner prefers the snappier change at once. A shadow under the
popups: muddy in the dark theme, and popups share one look, so none has one.

**Revisit if:** the mono is hard to read at small sizes, or the pointer light repaints too slowly there.
