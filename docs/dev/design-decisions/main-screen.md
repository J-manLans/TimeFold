# Main screen

What the owner sees: the layout of the main screen, and how its two figures, the balance bar and the ceiling wheel,
are drawn and coloured. Each decision follows the template in `README.md`, and is cited by its title.

## The main screen has a control side and a figures side (2026-11-14)

**Built by:** Clocking for the screen, the button, the balance bar and the list; Profiles for the profile button, the
ceiling wheel and the pay estimate; Handover for export and import.

**Decision:** the main screen has two sides, split by a divider (a sharp line or a gradient, settled when built). The
left side holds the controls and stays still: the start/stop button ("One start/stop button and a profile list"),
"Exportera" and "Importera" side by side under it, together as wide as it; the profile button beside both, as tall as
the two rows, a rectangle holding a raised disc set in a dent ("The look: a fresh display face, mono text, grain and
soft buttons") with the profile's first letter, capitalised, in the profile's colour, which with more than one profile
opens a popup of the profiles, centred on the left side; under the block, the status line naming what runs and since
when, which keeps its room even when empty; under that, centred and as wide as its text, "Lägg till paus" ("Time away is
a gap or an added break"), a smaller, quieter button, greyed out unless the profile on screen runs, whose length field
opens in its place, text starting at the left; the menu button at the top left, and at the bottom the line that offers
pruning ("Old history is pruned on request"). The menu grows out of its own button: pressed, the button's rounded
rectangle expands from the top left into a panel over the control side, stopping at the divider, and the menu's content
fades in once it is open; the three lines of the button turn into an × in the same spot, where the menu closes,
shrinking back into the button. The panel is frosted: slightly see-through, with the control side lightly blurred behind
it, and in the light theme tinted a little darker than the control side so it stands out. The figures stay sharp and in
view while settings change. New profiles are made from the menu. The right side is narrower, about two fifths of the
window, and is the living one, changing at each stop, and looks like a modern terminal dashboard, not a retro one: a
dark panel in every theme, numbers in a monospaced font with their digits lined up, thin lines, small uppercase labels,
and small, precise motion (numbers counting to their new value, the arc sweeping). A profile's colour is the over colour
of the figure it moves: the balance bar's for the profile with the balance, the ceiling wheel's for the others. While
the profile on screen runs, a ring in its colour surrounds the start button. Every focus ring in the app takes the
colour of the profile on screen. On the right side, from the top: the balance as a number, centred, with no label; the
balance bar; the ceiling wheel, centred under it with nothing beside it; the pay estimate as one quiet number under the
wheel, with no label; then the five most recent entries and "Visa alla", which opens a popup centred on the whole window
listing every entry, where entries are edited ("Editing an entry on its line").
**Why:** what the owner presses and what the owner reads each have their place. The menu growing out of its button makes
the icon part of the menu rather than a separate thing over it, and closing where it opened keeps the pointer still.
With the figures in view beside the menu, a colour changed in settings shows at once on the figures. The five most
recent entries show yesterday's work on a fresh morning, where today's alone would be an empty list. The break control
sits with what runs and never moves; the status line's kept room sets it a little apart, marking it as secondary.
Colouring a profile by the figure it moves ties the controls to what they change. The wheel tells its story alone, so
nothing beside it is needed, and the side can be narrower. A dashboard look suits figures that are read at a glance, and
a soft base colour with a neon-leaning over colour is how such dashboards use colour. A panel dark in every theme keeps
that look in light mode, and gives the figures one known background.
**Rejected:** today's entries only: empty every morning. A small balance bar beside a large wheel: both are figures the
owner reads every day. Figures beside the wheel (ceiling, used, left, carried): the wheel already shows them. A label on
the balance: the number alone is clear. "Lägg till paus" at the bottom left: the prune line would push it up and down. A
menu over the whole screen: it would hide the figures it changes. A drawer with a tab holding the icon: a fine picture,
but more parts than the growing button. The icon riding to the panel's far corner as an ×: the close button would not be
where the pointer is. A menu sliding in under a separate button: the icon would stay apart from the menu. A see-through
menu always present: nothing needs it when closed. A figures side that follows the light theme: the dashboard look would
be lost there. A retro terminal look (green on black, scan lines): the owner wants the direction, not the costume.
**Revisit if:** the window is too small for both sides, or the frosted blur is slow on WebKitGTK (then the panel is more
opaque, without blur).
**Cases:**
- One profile: the profile button opens nothing. Three profiles: a popup of the three, centred on the left side.
- Menu open: the figures are still in view, and a new base colour shows on them at once.
- Seven entries since yesterday: the newest five are listed, and "Visa alla" opens the rest.

## The look: a fresh display face, mono text, grain and soft buttons (2026-11-14)

**Built by:** Clocking, with the first screen.

**Decision:** the app's look, from the owner's art direction references (kept locally, not in git) and settled on the
main screen sketch:
- **Type:** Bricolage Grotesque, bold and at its narrowest width (75%), for the big things: "Starta jobb", the profile
  letter, the balance and the hours inside the ceiling wheel. JetBrains Mono for all other text on both sides, in
  normal case. The quiet lines, what runs and the offer to prune, share one small size (10.5 px) in the muted
  colour.
- **Colour:** flat fields with one hot accent, which the over colour already is. The figures side stays a dark panel
  ("The main screen has a control side and a figures side").
- **Grain:** a fine noise over both panels, stronger on the figures side, so surfaces read as printed rather than
  glassy.
- **Buttons:** flat, in the theme's button colour, with no border and no shading: corners of 5 px and a soft shadow
  offset down and to the right (5 px, 20 px blur, 30% black). Hovered, a little lighter; pressed, a faint shade from
  the top. Small controls and fields have 6 px corners, panels and popups 12 px.
- **Profile circle:** a raised disc in the button's own colour, lit from the top, sitting in a soft dent 6 px wide
  around it, after a CodePen pen (bthehuman, MIT); in the dark theme the dent is only a whisper darker than the button.
- **Ornament:** micro labels, registration marks and barcode strips only where they carry meaning; none for
  decoration alone.
- In code, these values are named variables in one place, so the look is tuned there.
**Why:** the owner likes the references' printed, technical feel, with something fresher and more modern for the big
type. A mono for the rest ties the controls to the dashboard. Flat buttons with one soft shadow keep the surfaces
calm; the indented disc gives the profile button a physical touch.
**Rejected:** a flat saturated colour field for the figures side: the dark panel stays. Rounder condensed faces
(Saira Extra Condensed, Big Shoulders Display, Teko): too round. Tektur, condensed: square and technical, but not
fresh enough for the big type; tried for all text, it was too much. Matte plastic buttons with grain, edge highlights
and a deeper shadow: they looked like 1990s 3D. Shaded or glossy buttons. A white profile circle: the button's own
colour reads better. Decorative micro labels: they say nothing.
**Revisit if:** the mono is hard to read at small sizes, or the grain costs too much on WebKitGTK.

## A light or dark theme, following the system (2026-11-14)

**Built by:** Clocking.

**Decision:** the control side and the menu have a theme setting: "System" (the default, following the computer's
light or dark mode), "Ljust" or "Mörkt". The figures side is dark in every theme ("The main screen has a control side
and a figures side"). Like the colours, the theme belongs to each machine and is not carried by the handover.
**Why:** the owner's two computers may be set differently, and following the system needs no choice at all; the
setting is there for when the app should differ from the system.
**Rejected:** one fixed theme: the control side should sit well beside the rest of the owner's desktop. The theme in
the handover: as with the colours, each machine is set up for its own screen.
**Revisit if:** the figures side should follow the theme after all.
**Cases:**
- System in dark mode, theme "System": the control side is dark.
- Theme "Ljust" on a dark system: the control side is light; the figures side stays dark.

## The balance bar (2026-11-14)

**Built by:** Clocking; its colour settings with the ceiling wheel's, in Profiles.

**Decision:** the janitor balance shows as a horizontal bar from a 0 line, minus to the left and plus to the right, with
the balance as a number above it. The bar is only its active part, with no track behind it, and is rounded only at its
outer end, square against the 0 line. Minus (hours to work in) is in the bar's base colour; plus (hours to take out) in
its over colour; exactly 0 is a marker centred on the 0 line, a little wider than a thin mark, in the base colour
dimmed, slowly and slightly growing and shrinking; the motion stops when the system asks for reduced motion. The bar's
full width is one of four scales, ±10, ±20, ±40 or ±80 h, with the scale's end labelled in small text: the smallest
whose 90% holds the balance. Crossing into a larger scale changes it with a short animation; it goes back down only once
the balance is within 80% of the smaller scale, so it does not flicker at a boundary. Beyond ±80 h the bar stays full at
its end. The bar's colours work as the ceiling wheel's ("The ceiling wheel"): a base and an over colour, each with a
picker, the dimmed colour worked out from the base and the over colour suggested from it, set per machine. One switch,
"Unify colours", is shown in both the bar's and the wheel's colour settings and stored once, on by default. While it is
on, the two share one set of colours, and a change in either place changes both. Turned on while they differ, the
colours of the place it is turned on from go to both. Turned off, each keeps what it has, and they are set apart from
then on. A large minus gets no warning.
**Why:** one meaning per colour across both figures: the over colour is "more than expected", which a plus balance is;
minus is work still to do, in the calm base colour; dimmed is "nothing either way". With no track, the dimmed marker at
0 stands on its own, and its slow pulse reads as at rest. Fixed scales keep the bar's length meaningful (half the bar is
half the labelled amount) while a balance saved up for a holiday week still fits. Turning unify on, the owner is looking
at the colours they want, so those win; one switch stored once cannot disagree with itself.
**Rejected:** a track behind the bar in the dimmed colour: the 0 marker would vanish into it. Minus in the over colour:
the over colour means hours beyond what is owed, which minus is not. A switch on the bar alone that makes it follow the
wheel: it made the wheel the leader for no reason. A fixed owner, such as the bar, when unify is turned on: turned on
from the wheel's settings, it would replace the colours being looked at. A warning for a large minus: the owner does not
want one. One fixed width cut off at its end: past it, the length means nothing. A scale always fitted to the balance:
the bar would always look full.
**Revisit if:** a third figure gets colours of its own, and unify has to say which it joins; or the scale changes
feel jumpy in daily use (a compressed far end, linear near 0, was the alternative).
**Cases:**
- Balance 0: the dimmed marker sits centred on the 0 line.
- Balance −3:00: a bar to the left in the base colour.
- Balance +5:00: a bar to the right in the over colour.
- Balance +12:00: the scale is ±20 h, and the bar reaches 60% of its side.
- Balance +21:00: the scale grows to ±40 h with a short animation; back at +17:00 it stays ±40 h; at +15:00 (within
  80% of 20) it returns to ±20 h.
- Unify on, the wheel's base changed to blue: the bar's base turns blue too, and both over colours follow the
  suggestion.
- Unify off, then the bar's over colour picked by hand: a later change to the wheel leaves the bar as it is.
- Wheel orange and bar green, unify turned on from the bar's settings: both turn green.

## The ceiling wheel (2026-11-14)

**Built by:** Profiles.

**Decision:** the ceiling shows as a ring, the ceiling wheel, with the month's used hours as a number in its centre. A
full ring is the month's ceiling. Two colours are settings of each machine, not carried by the handover: the base colour
and the over colour, each chosen with a colour picker alone (the system's own dialog). Every first install asks for them
("A first install starts fresh or imports"), offering a soft orange, `#d78951`, as the base; after that they change in
the settings menu, at once rather than from a date, since no count depends on them. A report draws the wheel in the
colours of the machine that exports it. The balance bar shares these colours while "Unify colours" is on ("The balance
bar"). Used hours fill the ring clockwise from 12 o'clock in the base colour; the unused rest is the base colour mixed
70% toward the background, in OKLab. When that leaves it within 0.15 lightness of the base, as black on a dark
background or white on a light one, the unused rest sits 0.15 past the background instead, on the side away from the
base, in the base's hue at 30% of its chroma, if that lands between lightness 0.05 and 0.98. Hours over the ceiling are
in the over colour: a second lap from 12 o'clock, drawn over the base colour on the same ring. That lap is what carries
into the next month, where those hours show in the base colour. From 90% of the ceiling the centre number takes the over
colour; the ring keeps its colours. The over colour starts as a suggestion worked out from the base colour, and a new
base colour brings a new suggestion; the owner may pick another, and go back to the suggestion with one click. Nothing
warns when a picked over colour is close to the base: it is the owner's choice. The suggestion, in OKLCH: the base's hue
turned 55° toward red (hue 29°), stopping at red, going down through yellow for hues up to 170° and up through violet
above; a grey base (chroma under 0.04) turns to red. The turned hue is taken at the lightness where it is most vivid
(the most chroma sRGB allows, sought between lightness 0.2 and 0.98), and as vivid as sRGB allows at that lightness, but
at least 0.15 lighter or darker than the base: lighter only when the hue turned at least 10°, its most vivid lightness
is at least 0.15 above the base and the base is at most 0.75, or when darker would fall under 0.3.
**Why:** one base colour keeps the ring one family, and turning toward red reads as "too much" in any family. Where two
colours meet edge to edge the eye parts them by lightness, and two strong colours of equal lightness flicker, hence the
gap; the unused rest keeps it from the base too, framing a base that is close to the background. No formula suits every
base (near black, greys), so the suggestion can be overridden, and the owner sees the result at once. The number warns
in the colour that is coming. The colours are a matter of each screen, and keeping them out of the handover keeps the
file to what the counts need.
**Rejected:** the over colour always red: a red base would hide it. An amber number at 90%: the over colour says the
same and needs no third colour. Turning 30°: blue, cyan, yellow and pink stayed too close to their base. Always darker:
green went olive and orange brown. The rule's numbers as settings: they could undo the contrast; they are tuned once, by
eye, on a sketch. A fixed set of colours with chosen over colours: it limits the base, while the suggestion with an
override covers the corners. The excess as a thinner second ring inside: two rings to read for one figure. Shrinking the
ring so the used and the excess share it: a full ring would stop meaning the ceiling. Example swatches for the base, or
a grid of options for the over colour: the owner picks once and knows what they want, and the suggestion already gives
the over colour a start. A picker built into the app: the system dialog costs nothing; one of its own is built only if
the system one bothers the owner. The colours carried by the handover: each machine is set up once, and the file stays
simpler.
**Revisit if:** a month goes more than a whole ceiling over, which one lap cannot show; or the suggestion is often
overridden; or the system colour dialog is awkward on one of the machines.
**Cases:**
- Ceiling 42 h, 21 h used: half the ring in the base colour, half dimmed; the number in the base colour.
- Ceiling 42 h, 38 h used: the number in the over colour (90% is 37.8 h); the ring has no over lap.
- Ceiling 42 h, 46 h used: the ring full, with the over colour over 4/42 of it from 12 o'clock; the next month starts
  with 4 h in the base colour.
- Suggestions: orange `#f28c28` gives red `#e80003`; green `#3aa655` gives golden yellow `#fcd000`; purple `#8e5bd6`
  gives deep magenta `#940056`; blue `#3b7be0` gives deep violet `#7d00a5`; cyan `#1fb5c4` gives blue `#0064fc`;
  yellow `#e8c22a` gives red-orange `#fd5300`; pink `#e35d9c` gives crimson `#c50001`; red `#d93a3a` gives dark red
  `#9e0001`; grey `#8a8a8a` gives dark red `#b40001`; black and white give red `#ff0a0a`.
- Black on a dark background: the unused rest is a dark grey, lighter than the background. White on a light
  background: a light grey, darker than the background. Orange on either: mixed toward the background as usual.
- A first install with the colours left as offered: base `#d78951`, over its suggestion, red `#d60002`.
- Blue picked at home, orange at work: after a handover each machine keeps its own colours.
- Base changed from orange to blue after picking an over colour: the over colour returns to the suggestion for blue.
