# Main screen: colours

The colours each profile carries: its hue, base and over colour, how they are picked and where they go. The figures
that wear them are in `figures.md`. Each decision follows the template in `../README.md`, and is cited by its title.

## Each profile carries its colours (2026-11-15)

**Built by:** Profiles; Clocking for the balance profile's colours on the flex bar.

**Decision:** each profile has a hue, a base colour and an over colour. The hue and the base are set in the profile's
row in the menu with one swatch and the app's own colour picker; the over colour follows from the hue and is never
picked by hand. The picker opens straight onto a colour map (saturation and lightness) with a hue strip under it and
the colour's code, placed so it always fits inside the menu; only the swatch opens it.
- **The hue** is where the strip sits. The strip's colour, at full saturation and value, is the hue's neon. The strip
  is remembered with the profile, so a base dragged to grey, black or white keeps its hue, and a typed grey code leaves
  the strip where it is.
- **The base colour** is any nuance of the hue, picked in the map.
- **The over colour**, in OKLCH: the hue opposite the strip's colour (its hue plus 180°), at the lightness where that
  hue is most vivid (the most chroma sRGB allows, sought between lightness 0.2 and 0.98), with all the chroma sRGB
  allows there. It moves only when the strip moves; dragging in the map leaves it alone.
- **The dimmed colour** is the base mixed 70% toward the panel's background, in OKLab; when that leaves it within 0.15
  lightness of the base, it sits 0.15 past the background instead, on the side away from the base, in the base's hue
  at 30% of its chroma, if that lands between lightness 0.05 and 0.98.

Dragging and typing change only the picker's preview. The app takes the colour when the pointer is released, or when
Enter is pressed in the code field; "OK" keeps it and closes the picker; Esc, a click outside or scrolling the menu
closes it and puts back the colours from before it opened. While a profile's picker is open, the ceiling wheel is that
profile's, with its pieces lit, and returns to the profile on screen when the picker closes; the balance profile's
picker leaves the wheel grey, since its colours show on the flex bar. Colours change at once, not from a date,
since no count depends on them, and they travel with the profile in the handover.

No colour is asked for. The profile with the balance starts on the OKLCH hue 195°, a cyan: base `#7ed6d5`, over
`#fc0055`. A new profile's hue is the middle of the largest gap between the hues in use on the colour circle, each
profile using two, its own and the opposite one its over colour has (a random pick between gaps of equal size). Its
strip is set to that hue's neon, and its base is the neon muted: 55% of the neon's chroma, at a lightness 40% of the
way from the neon's own toward 0.70. The colours go to:
- the control side, for the profile on screen: its letter (in the over colour), the ring around the
  start button, the warning label, the focus rings, the status line's mark;
- the small profile circles in the menu and the profile popup: the letter in the over colour, ringed in the base
  colour, the same pair the figures show;
- the flex bar, always the balance profile's ("The flex bar");
- the ceiling wheel, the profile on screen's when it is one of the others ("The ceiling wheel").
**Why:** a colour per profile tells the profiles apart where they are chosen and run, and the figures follow the
profile they belong to. A muted base with the opposite hue at full neon makes the over colour the one hot accent by
construction, and the two can never land close together. The opposite hues gather on the screen's strongest colours,
so the over colour holds still across a whole colour range and the pair feels coherent wherever the base is dragged.
The strip owning the hue means one control moves the over colour and the other never does, and a grey base still has
an over colour for a visible reason. Counting the opposite hues in the gap keeps a second profile from being the first
one mirrored. Taking the colour on release shows it where it will live, on the panel beside the figures, without
recolouring the app at every movement of a drag. The formula's colours are good enough that nothing needs asking at
the first start or for a new profile; the picker stays because personalising is fun. A profile's colours are part of
the profile, so they look the same on both machines.
**Rejected:** the over colour as the base turned 55° toward red, with a picker of its own to override it: most over
colours ended up near red, and the owner kept changing them by hand. The over colour worked out from the finished base
colour: dragging in the map nudged its hue, so the over colour drifted. A new profile's hue farthest from the other
bases only: with one profile it is the opposite hue, the first profile with base and over swapped. Recolouring the app
while dragging: many updates for nothing. Recolouring only at "OK": the colour could not be judged in place. A switch
in the menu to put a profile on screen: a second way to do what the profile button does; the picker's profile owning
the wheel covers it. Asking for colours at the first start: the formula gives a good start, and the picker is one
click away. Colours of the figures' own, with a switch to unify them: the profiles carry them. Colours derived from
the figures: every profile but the balance one shared the wheel's colour. Random colours for new profiles: two could
land side by side. Colours per machine, out of the handover: a profile would look different at work and at home. The
over colour always red: a red base would hide it. The rule's numbers as settings: they could undo the contrast; they
are tuned once, by eye, on a sketch. Example swatches, or a grid of options: the owner knows what they want. The
system's colour dialog: on Linux it opened on a palette first, not the colour map, and did not draw fully.
**Revisit if:** the generated colours are often changed, or two profiles' over colours need telling apart.
**Cases:**
- The first start: the balance profile has hue 195°, base `#7ed6d5` and over `#fc0055`, and no colour was asked for.
- One profile at hue 195°: a new profile gets hue 105° (base `#d4ce78`, over `#6400fd`) or 285° (base `#7368d4`,
  over `#fdee00`).
- Profiles at hues 195° and 285°: the hues in use are 15°, 105°, 195° and 285°, four gaps of 90°, so a third profile
  gets 60°, 150°, 240° or 330°.
- Over colours by where the strip sits (0° red, 60° yellow, 120° green, 180° cyan, 240° blue, 300° magenta):
  `#00e4fd`, `#740aff`, `#e400fe`, `#fc0056`, `#ffbf00`, `#00fe6c`.
- The strip on green, the map dragged from a strong green to a pale one, to grey, to black: the base changes each
  time, the over colour stays `#e400fe`.
- A grey base, the picker reopened: the strip is where it was left.
- The code field: `#808080` and Enter gives a grey base, with the strip and the over colour unchanged.
- Dragging along the strip: the app's colours do not change until the pointer is released; then the base and the over
  colour both change.
- A colour released twice in the picker, then Esc: the base, the strip and the over colour are as before the picker
  opened. The same, then "OK": the last released colour stays.
- Profile A on screen, B's picker opened: the wheel is in B's colours with B's pieces lit; the picker closed: the
  wheel is A's again.
- The balance profile's picker opened: the wheel stays grey, and the bar takes the released colour.
- Black on a dark panel: the dimmed colour is a dark grey, lighter than the panel.
- Utveckling made blue at work: after a handover it is blue at home too.
