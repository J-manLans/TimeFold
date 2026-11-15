# Main screen: look
 How the app looks: type, colour, surfaces and buttons, and the light or dark theme. Each decision follows the template
in `../README.md`, and is cited by its title.

## The look: a fresh display face, mono text and soft buttons (2026-11-15)

**Built by:** Clocking, with the first screen.

**Decision:** the app's look, from the owner's art direction references (kept locally, not in git) and settled on the
main screen sketch:
- **Type:** Bricolage Grotesque, bold and at its narrowest width (75%), for the big things: "Starta jobb", the profile
  letter, the balance and the hours inside the ceiling wheel. JetBrains Mono for all other text on both sides, in
  normal case. The quiet lines, what runs, the offer to prune and the short messages after an action (such as
  "Rensar efter en kopia"), share one small size (10.5 px) in the muted colour.
- **Colour:** flat fields with one hot accent, which the over colour already is. Each theme colour is set once, with its
  light and dark value side by side. The dashboard is near-black in the dark theme and slate blue in the light theme,
  each a tinted family of panel, rows, lines and text ("The main screen has a controls side and a dashboard").
  Contrast is balanced across the themes, a little stronger in the light one, where faint lines read weaker at the same
  ratio, and stronger still on its blue-tinted frost: in the menu, text stands at about 13.8:1 and quiet text 8.8:1
  (light), lines at about 1.95:1 (light) and 1.5:1 (dark) against the frost, and the borders of fields and small buttons
  at about 2.7:1 and 2.0:1, as measured on the sketch.
- **Buttons:** flat, in the theme's button colour (in the light theme the dashboard's blue, a step deeper, `#4f688e`,
  with near-white text at 5.2:1, hovered `#40577b` at 6.8:1; in the dark theme a dark grey with light text; a little
  bolder text on the smaller buttons), with no border and no shading: corners of 5 px and a soft, quiet shadow offset
  down and to the right (2 by 3 px, 12 px blur, 14% black). Hovered, a little lighter; pressed, a faint shade from the
  top. Small controls and fields have 6 px corners, panels and popups 12 px. Around them, the light theme's controls
  side is in cool greys (the page `#f2f4f7`, quiet text `#556070` at 5.8:1), so it sits with the blue; fields are white
  and the colour picker `#e6ecf4`. The profile popup takes the button colour, with the chosen or hovered profile a
  lighter step (`#5f789e` in the light theme), as in the dark theme.
- **Profile circle:** a raised disc in the button's own colour, lit from the top, its letter in the profile's colour (if
  a profile's colour reads poorly on the button, the owner changes it with the picker), sitting in a soft dent 6 px wide
  around it, after a CodePen pen (bthehuman, MIT); the dent is see-through in both themes, so it is always a soft shade
  of the button's own colour, whatever that colour is. In the light theme its highlights and shadows are tinted blue,
  not white or black, so they sit with the blue button. The theme button's disc is in the buttons' own colour too, with
  a light icon; it catches the pointer light like the other discs.
- **Motion:** every transition in the interface takes the same 0.2 seconds, one setting for all: hover and press, the
  start button's ring and label, the status line, buttons waking and dimming, the menu, tabs and rows, the warning
  label, the profile letter's colour, and a change of theme. A text that changes fades out, swaps and fades back in
  within that time. Animations that tell something over longer, such as the numbers counting at stop or the undo's fade,
  keep their own length.
- **Light:** a soft, matte light follows the pointer over the controls side: one light shared by all buttons, reaching
  about 70 px from the pointer (far enough to flow across buttons, near enough that a button visibly lights up as the
  pointer enters it), so it lies only on button surfaces and flows across them, faint and tinted (stronger on the light
  theme's blue than on the dark grey), fading in and out with the pointer. The discs catch it too, at full strength,
  except the profile disc, which catches it at half strength and so stays a little apart; on the undo disc it lies over
  the coloured drape, under the arrow. While the menu is open, the light leaves the buttons under its frost, which it
  would seem to shine through, and lies only on what is in the menu. The small text buttons in the menu ("Ändra", "OK",
  "Ny profil", "Använd default", "Arkivera") stay plain, without the light: it marks the main controls and the discs,
  the theme disc among them. A disabled button reacts to nothing: no light, no hover, no press; and every unavailable
  button fades by the same amount (to 40%), so "Lägg till paus" and the undo match side by side.
- **Ornament:** micro labels, registration marks and barcode strips only where they carry meaning; none for
  decoration alone.
- In code, these values are named variables in one place, so the look is tuned there.
**Why:** the owner likes the references' printed, technical feel, with something fresher and more modern for the big
type. A mono for the rest ties the controls to the dashboard. Flat buttons with one soft shadow keep the surfaces
calm; the indented disc gives the profile button a physical touch.
**Rejected:** a flat saturated colour field for the dashboard: the dark panel stays. Rounder condensed faces (Saira
Extra Condensed, Big Shoulders Display, Teko): too round. Tektur, condensed: square and technical, but not fresh enough
for the big type; tried for all text, it was too much. Matte plastic buttons with grain, edge highlights and a deeper
shadow: they looked like 1990s 3D. Shaded or glossy buttons. A white profile circle: the button's own colour reads
better. Decorative micro labels: they say nothing. Light grey buttons in the light theme: they barely stood off the page
(1.08:1, later 1.29:1); the blue ties the controls side to the dashboard. An outline around the profile letter: it
looked silly. No light on the discs: it set them apart, but less naturally; the profile disc's half strength keeps a
little of both. A fine grain over the panels: tried, it added nothing. A near-white theme disc in the light theme: the
blue one sits better with the other buttons.
**Revisit if:** the mono is hard to read at small sizes, or the pointer light repaints too slowly there.


## A light or dark theme, following the system (2026-11-14)

**Built by:** Clocking.

**Decision:** the app has a theme setting: "System" (the default, following the computer's light or dark mode), "Ljust"
or "Mörkt". It is a round button beside the menu's heading, drawn like the profile button's disc in its dent: a sun for
Ljust, a moon for Mörkt, a half-filled circle for System; each click moves to the next, and a label names the one in
force. The dashboard follows it too, as a near-black panel in the dark theme and a slate-blue one in the light theme
("The main screen has a controls side and a dashboard"). The theme belongs to each machine and is
not carried by the handover.
**Why:** the owner's two computers may be set differently, and following the system needs no choice at all; the
setting is there for when the app should differ from the system.
**Rejected:** three buttons in a tab of their own: one round button in the heading is enough. One fixed theme: the
controls side should sit well beside the rest of the owner's desktop. The theme in the handover: each machine is set up
for its own screen and room.
**Revisit if:** the dashboard should follow the theme after all.
**Cases:**
- System in dark mode, theme "System": the controls side is dark.
- Theme "Ljust" on a dark system: the controls side is light, and the dashboard slate blue.
