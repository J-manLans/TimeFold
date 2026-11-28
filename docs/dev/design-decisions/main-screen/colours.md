# Main screen: colours

The colours each profile carries: its hue, base and neon, how they are picked and where they go. The figures that wear
them are in `figures/`. Each decision follows the template in `../README.md`, and is cited by its title.

## Each profile carries its colours (2026-11-18)

**Decision:** each profile has a hue, a base colour and a neon. Only the hue is picked, with the app's own colour
picker; the base and the neon follow from it and are never picked by hand. The profile's row in the menu shows "Färg"
with the pair it wears, the base and the neon as two small swatches, and "Ändra", like every value in the menu, which
opens the picker; a second press closes it. The picker opens onto a hue strip, and under it two rows, each a small
swatch and a code: the base's, then the neon's. The picker is as wide as the rows, the strip spanning it. The codes can
be selected and copied but not typed in. The picker is placed so it always fits inside the menu; only "Ändra" opens it.

- **The hue** is where the strip sits. The strip shows each hue as its base colour, so what is picked is what the
  profile wears. The circle dragged along it is filled with the neon of where it sits, following the drag, with no
  border or ring, only a soft shadow, the same size and edge as the entry line's handles ("A clicked handle steps by the
  minute"); nothing else changes until the pointer is released. The strip is remembered with the profile.
- **The base colour** is the hue muted and drawn toward a soft middle lightness.
- **The neon** is the opposite hue at its most vivid, in OKLCH. It moves only when the strip moves.
- **The dimmed colour** is the base faded toward the panel it sits on, and kept a visible step from the base where the
  fade would leave it too close.

The rule's numbers live in `src/lib/modules/shared/colours.ts` and its tests.

Dragging changes only the picker's preview. The app takes and keeps the colour when the pointer is released, with no
button to confirm it; Esc, a click outside or scrolling the menu only closes the picker. While a profile's picker is
open, the ceiling wheel is that profile's, with its pieces lit, and returns to the profile on screen when the picker
closes; the balance profile's picker leaves the wheel grey, since its colours show on the flex bar. Colours change at
once, not from a date, since no count depends on them, and they travel with the profile in the handover.

No colour is asked for. The profile with the balance starts on a cyan. A new profile's hue is the middle of the largest
gap between the hues in use on the colour circle, each profile using two, its own and the opposite one its neon has (a
random pick between gaps of equal size); its base and neon follow from it. The colours go to:

- what is happening now, in the neon of the profile it concerns: the ring around the start button, the status line's
  mark, the warning label, the undo's afterglow and the tip's edge;
- where a profile stands, the same pair the figures show, swapping as its figure crosses its line: past it (the balance
  in plus, or the ceiling passed) the letter is in the neon, and before it (at 0 or below) in the base colour. The
  profile button's letter and every focus ring wear the profile on screen's; the small profile circles in the menu and
  the profile popup wear each profile's own, the letter in that colour and the ring in the other;
- the flex bar, always the balance profile's ("The flex bar"), and the flex days marked in the calendar, in its base
  colour ("A flex day can be marked ahead, and the screen counts it at once");
- the ceiling wheel, the profile on screen's when it is one of the others ("The ceiling wheel").

**Why:** a colour per profile tells the profiles apart where they are chosen and run, and the figures follow the profile
they belong to. What is happening now is hot, so a running job shows from across the room; where a profile stands
follows the figures' own rule, the neon meaning "more than expected", so the letter and the focus rings read the balance
at a glance, and the swapping pair keeps both colours on screen as the flex bar's end marks do. A muted base with the
opposite hue at its most vivid makes the neon the one hot accent by construction, and the two can never land close
together. Picking only the hue keeps that true: no base can be dragged as hot as the neon. The opposite hues gather on
the screen's strongest colours, so the neon holds still across a whole colour range. The strip in base colours shows
what is picked, and the two codes under it show the pair, which is what the owner tunes by eye; they are only read,
since a typed code off the rule would have to be changed or refused. Counting the opposite hues in the gap keeps a
second profile from being the first one mirrored. Taking the colour on release shows it where it will live, on the panel
beside the figures, without recolouring the app at every movement of a drag. The formula's colours are good enough that
nothing needs asking at the first start or for a new profile; the picker stays because finding a pair that looks good is
fun. A profile's colours are part of the profile, so they look the same on both machines.

**Rejected:** one swatch of the base, itself opening the picker: past its line the profile wears the neon, so the swatch
showed a colour the letter beside it did not. The swatch in the colour of where the profile stands: it would change by
itself as the balance crosses its line. The neon as the base turned 55° toward red, with a picker of its own to override
it: most neons ended up near red, and the owner kept changing them by hand. The neon worked out from the finished base
colour: dragging in the map nudged its hue, so the neon drifted. A colour map for the base (saturation and lightness):
the owner dragged only the hue, and the map could make a base as hot as the neon, undoing the one hot accent; grey,
black and white bases went with it. A code field to type in: a code off the rule would be changed or refused. The strip
in neons: it showed a colour the profile never wears. The strip in pairs: busier, while the codes under it already show
the pair. A new profile's hue farthest from the other bases only: with one profile it is the opposite hue, the first
profile with base and neon swapped. Recolouring the app while dragging: many updates for nothing. Recolouring only at
"OK": the colour could not be judged in place. An "OK" button at all: each release already keeps the colour, so it
confirmed nothing; Esc putting back the colours from before the picker opened went with it, since dragging back does the
same. A switch in the menu to put a profile on screen: a second way to do what the profile button does; the picker's
profile owning the wheel covers it; handy while testing, clutter in the finished app. Asking for colours at the first
start: the formula gives a good start, and the picker is one click away. Colours of the figures' own, with a switch to
unify them: the profiles carry them. Colours derived from the figures: every profile but the balance one shared the
wheel's colour. Random colours for new profiles: two could land side by side. Colours per machine, out of the handover:
a profile would look different at work and at home. The neon always red: a red base would hide it. The rule's numbers as
settings: they could undo the contrast; they are tuned once, by eye, on a sketch. Example swatches, or a grid of
options: the owner knows what they want. The system's colour dialog: on Linux it opened on a palette first, not the
colour map, and did not draw fully. The focus rings always in the neon: on the light controls side the neons fade as
much as the bases (23 of 36 hues under 3:1 against 28), and they said nothing. The focus rings by theme, the neon in the
light theme and the base in the dark, for the best contrast: they would say nothing of the balance. The running ring and
the status mark following the balance: in a muted base the one signal seen from across the room would fade.

**Revisit if:** the generated colours are often changed, two profiles' neons need telling apart, or a base off the rule
is wanted, such as grey or a lighter shade.
