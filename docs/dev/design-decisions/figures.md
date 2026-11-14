# Figures

The two figures on the main screen, the balance bar and the ceiling wheel, and the colours they and the profiles
carry. Each decision follows the template in `README.md`, and is cited by its title.

## The balance bar (2026-11-14)

**Built by:** Clocking; its colours from the balance profile in Profiles.

**Decision:** the janitor balance shows as a horizontal bar from a 0 line, minus to the left and plus to the right, with
the balance as a number above it. The bar is only its active part, with no track behind it, and is rounded only at its
outer end, square against the 0 line. It takes the colours of the profile with the balance ("Each profile carries its
colours"): minus (hours to work in) in its base colour; plus (hours to take out) in its over colour; exactly 0 a marker
centred on the 0 line, a little wider than a thin mark, in the base colour dimmed, slowly and slightly growing and
shrinking; the motion stops when the system asks for reduced motion. The bar's full width is one of four scales, ±10,
±20, ±40 or ±80 h, with ten small marks on each side from the 0 line to the scale's end, the end mark taller and
labelled in small text: the smallest whose 90% holds the balance. Crossing into a larger scale changes it with a short
animation; it goes back down only once the balance is within 80% of the smaller scale, so it does not flicker at a
boundary. Beyond ±80 h the bar stays full at its end. A large minus gets no warning.
**Why:** one meaning per colour: the over colour is "more than expected", which a plus balance is; minus is work still
to do, in the calm base colour; dimmed is "nothing either way". The bar is always janitor work, so it always wears the
balance profile's colours. With no track, the dimmed marker at 0 stands on its own, and its slow pulse reads as at
rest. Fixed scales keep the bar's length meaningful (half the bar is half the labelled amount) while a balance saved up
for a holiday week still fits.
**Rejected:** a track behind the bar in the dimmed colour: the 0 marker would vanish into it. Minus in the over colour:
the over colour means hours beyond what is owed, which minus is not. Colours of the bar's own, shared with the wheel
through a "Förena färger" switch: the colours belong to the profiles. A warning for a large minus: the owner does not
want one. One fixed width cut off at its end: past it, the length means nothing. A scale always fitted to the balance:
the bar would always look full.
**Revisit if:** the scale changes feel jumpy in daily use (a compressed far end, linear near 0, was the alternative).
**Cases:**
- Balance 0: the dimmed marker sits centred on the 0 line.
- Balance −3:00: a bar to the left in Vaktmästare's base colour.
- Balance +5:00: a bar to the right in Vaktmästare's over colour.
- Balance +12:00: the scale is ±20 h, and the bar reaches 60% of its side.
- Balance +21:00: the scale grows to ±40 h with a short animation; back at +17:00 it stays ±40 h; at +15:00 (within
  80% of 20) it returns to ±20 h.
- Utveckling on screen: the bar keeps Vaktmästare's colours.

## The ceiling wheel (2026-11-14)

**Built by:** Profiles.

**Decision:** the ceiling shows as a ring, the ceiling wheel, with the month's used hours as a number in its centre. A
full ring is the month's ceiling. It takes the colours of the profile on screen when that is one of the other profiles,
and greys while the profile with the balance is on screen: base `#9aa3ae`, over a light grey `#e2e6eb` (not the red the
colour rule would suggest), so the dimmed rest, the base and the over lap are three clearly different greys, dark,
middle and light, ("Each profile carries its colours"); a report draws it in the grey. Used hours fill the ring
clockwise from 12 o'clock in the base colour; the unused rest is dimmed. Hours over the ceiling are in the over colour:
a second lap from 12 o'clock, drawn over the base colour on the same ring. That lap is what carries into the next month,
where those hours show in the base colour. From 90% of the ceiling the centre number takes the over colour; the ring
keeps its colours. The wheel's numbers never depend on its colours: switching profile changes only how it looks.
**Why:** the over lap shows the excess the moment it happens, and a full ring always means the ceiling; one ring reads
at a glance. The number warns in the colour that is coming. The wheel sums all the other profiles, so its colour says
which of them is on screen; with the balance profile on screen, none is, hence greys that sit on both themes' panels;
the light grey keeps "over" readable without a colour that belongs to no profile.
**Rejected:** the excess as a thinner second ring inside: two rings to read for one figure. Shrinking the ring so the
used and the excess share it: a full ring would stop meaning the ceiling. An amber number at 90%: the over colour says
the same and needs no third colour. Colours of the wheel's own, set per machine: the colours belong to the profiles.
The wheel in segments, one per profile: more than the owner needs. Keeping the last other profile's colours while the
balance profile is on screen: the wheel would seem to belong to a profile that is not chosen.
**Revisit if:** a month goes more than a whole ceiling over, which one lap cannot show.
**Cases:**
- Ceiling 42 h, 21 h used: half the ring in the base colour, half dimmed; the number in the base colour.
- Ceiling 42 h, 38 h used: the number in the over colour (90% is 37.8 h); the ring has no over lap.
- Ceiling 42 h, 46 h used: the ring full, with the over colour over 4/42 of it from 12 o'clock; the next month starts
  with 4 h in the base colour.
- Utveckling (blue) on screen: the wheel is blue; Vaktmästare on screen: the wheel is grey `#9aa3ae` with a light grey
  `#e2e6eb` over the ceiling; the hours are the same in both.

## Each profile carries its colours (2026-11-14)

**Built by:** Profiles.

**Decision:** each profile has a base colour and an over colour, set in its row in the menu, each with the app's own
colour picker: a swatch that opens straight onto a colour map (saturation and lightness), with a hue strip and the
colour's code, placed so it always fits inside the menu. Only the swatch opens it. Dragging and typing change only the
picker's preview; "OK" saves the colour and closes it, while Esc or a click outside closes it without saving; they
change at once, not from a date, since no count depends on them, and they travel with the profile in the handover. The
profile with the balance starts with the base `#d78951`, a soft orange; the first start asks for its colours ("A first
install starts fresh or imports"). A new profile's base is the colour farthest from the others: in OKLCH, the hue in the
middle of the largest gap between the existing profiles' base hues on the colour circle (a random pick between gaps of
equal size), at their average lightness and vividness. The colours go to:
- the control side, for the profile on screen: its letter (in the over colour), the ring around the
  start button, the warning label, the focus rings, the status line's mark;
- the balance bar, always the balance profile's ("The balance bar");
- the ceiling wheel, the profile on screen's when it is one of the others ("The ceiling wheel").
The over colour starts as a suggestion worked out from the base, and a new base brings a new suggestion; the owner may
pick another, and go back to the suggestion with one click. Nothing warns when a picked over colour is close to the
base: it is the owner's choice. The suggestion, in OKLCH: the base's hue turned 55° toward red (hue 29°), stopping at
red, going down through yellow for hues up to 170° and up through violet above; a grey base (chroma under 0.04) turns
to red. The turned hue is taken at the lightness where it is most vivid (the most chroma sRGB allows, sought between
lightness 0.2 and 0.98), and as vivid as sRGB allows at that lightness, but at least 0.15 lighter or darker than the
base: lighter only when the hue turned at least 10°, its most vivid lightness is at least 0.15 above the base and the
base is at most 0.75, or when darker would fall under 0.3. The dimmed colour is the base mixed 70% toward the panel's
background, in OKLab; when that leaves it within 0.15 lightness of the base, it sits 0.15 past the background instead,
on the side away from the base, in the base's hue at 30% of its chroma, if that lands between lightness 0.05 and 0.98.
**Why:** a colour per profile tells the profiles apart where they are chosen and run, and the figures follow the
profile they belong to; the largest gap keeps every new colour as far as possible from its neighbours. Turning toward
red reads as "too much" in any colour family. Where two colours meet edge to edge the eye parts them by lightness, and
two strong colours of equal lightness flicker, hence the gap. No formula suits every base, so the suggestion can be
overridden. A profile's colours are part of the profile, so they look the same on both machines.
**Rejected:** colours of the figures' own, with a switch to unify them: the profiles now carry them. Colours derived
from the figures: every profile but the balance one shared the wheel's colour. Random colours for new profiles: two
could land side by side. Colours per machine, out of the handover: a profile would look different at work and at home.
The over colour always red: a red base would hide it. Turning 30°: blue, cyan, yellow and pink stayed too close to their
base. Always darker: green went olive and orange brown. The rule's numbers as settings: they could undo the contrast;
they are tuned once, by eye, on a sketch. Example swatches, or a grid of options for the over colour: the owner picks
once and knows what they want. The system's colour dialog: on Linux it opened on a palette first, not the colour map,
and did not draw fully.
**Revisit if:** the suggestion is often overridden.
**Cases:**
- Profiles at base hues 29° and 210°: the gaps are 181° and 179°, so a new profile gets about 120°.
- A third profile added to two opposite ones: it lands in the middle of one of the two equal gaps.
- Suggestions: orange `#f28c28` gives red `#e80003`; green `#3aa655` gives golden yellow `#fcd000`; purple `#8e5bd6`
  gives deep magenta `#940056`; blue `#3b7be0` gives deep violet `#7d00a5`; cyan `#1fb5c4` gives blue `#0064fc`;
  yellow `#e8c22a` gives red-orange `#fd5300`; pink `#e35d9c` gives crimson `#c50001`; red `#d93a3a` gives dark red
  `#9e0001`; grey `#8a8a8a` gives dark red `#b40001`; black and white give red `#ff0a0a`; the soft orange `#d78951`
  gives red `#d60002`.
- Black on a dark panel: the dimmed colour is a dark grey, lighter than the panel.
- A profile's base changed from orange to blue after picking an over colour: the over colour returns to the
  suggestion for blue.
- Utveckling made blue at work: after a handover it is blue at home too.
