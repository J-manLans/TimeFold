# Main screen: figures

The two figures on the main screen, the flex bar and the ceiling wheel. The colours they and the profiles carry are in
`colours.md`. Each decision follows the template in `../README.md`, and is cited by its title.

## The flex bar (2026-11-15)

**Built by:** Clocking; its colours from the balance profile in Profiles.

**Decision:** the janitor balance shows as a horizontal bar from a 0 line, minus to the left and plus to the right, with
the balance as a number above it. The bar is only its active part, with no track behind it, and is rounded only at its
outer end, square against the 0 line. It is half as thick as the ceiling wheel's band, centred on the 0 line, which
keeps its full height and stands out above and below it. It takes the colours of the profile with the balance ("Each
profile carries its colours"): minus (hours to work in) in its base colour; plus (hours to take out) in its over colour;
exactly 0 a marker centred on the 0 line, a little wider than a thin mark, in the base colour dimmed, slowly and
slightly growing and shrinking; the motion stops when the system asks for reduced motion. The number above follows the
bar: base colour for minus, over colour for plus, the main text colour at exactly 0. The bar's full width is one of four
scales, ±10, ±20, ±40 or ±80 h, with ten small marks on each side from the 0 line to the scale's end, the end mark
taller and labelled in small text; each side's end mark and its label wear that side's colour (minus the base, plus the
over), the other marks stay grey. The scale is the smallest whose 90% holds the balance. Crossing into a larger scale
changes it with a short animation; it goes back down only once the balance is within 80% of the smaller scale, so it
does not flicker at a boundary. Beyond ±80 h the bar stays full at its end. A large minus gets no warning.

**Why:** one meaning per colour: the over colour is "more than expected", which a plus balance is; minus is work still
to do, in the calm base colour; dimmed is "nothing either way". The bar is always janitor work, so it always wears the
balance profile's colours. With no track, the dimmed marker at 0 stands on its own, and its slow pulse reads as at rest.
The coloured end marks keep both of the profile's colours on screen at any balance, each where it means something, so
the pair is seen together and the number is free to follow the bar, as the wheel's number follows its fill. Fixed scales
keep the bar's length meaningful (half the bar is half the labelled amount) while a balance saved up for a holiday week
still fits.

**Rejected:** the name "balance bar": the bar measures flex time. A track behind the bar in the dimmed colour: the 0
marker would vanish into it. Minus in the over colour: the over colour means hours beyond what is owed, which minus is
not. The number in the colour opposite the bar's, to show both colours: a minus in red reads as a warning, and red would
mean "over" everywhere but there. Every mark in its side's colour: busy. Colours of the bar's own, shared with the wheel
through a "Förena färger" switch: the colours belong to the profiles. A warning for a large minus: the owner does not
want one. One fixed width cut off at its end: past it, the length means nothing. A scale always fitted to the balance:
the bar would always look full.

**Revisit if:** the scale changes feel jumpy in daily use (a compressed far end, linear near 0, was the alternative).

**Cases:**

- Balance 0: the dimmed marker sits centred on the 0 line.
- Balance −3:00: a bar to the left in Vaktmästare's base colour.
- Balance +5:00: a bar to the right in Vaktmästare's over colour.
- Balance −3:00: the number in the base colour; the −10 h end mark and label in the base colour, the +10 h ones in the
  over colour, the other marks grey.
- Balance +12:00: the scale is ±20 h, and the bar reaches 60% of its side.
- Balance +21:00: the scale grows to ±40 h with a short animation; back at +17:00 it stays ±40 h; at +15:00 (within 80%
  of 20) it returns to ±20 h.
- Utveckling on screen: the bar keeps Vaktmästare's colours.

## The ceiling wheel (2026-11-15)

**Built by:** Profiles.

**Decision:** the ceiling shows as a ring, the ceiling wheel, with the month's used hours as a number in its centre. A
full ring is the month's ceiling; its band is 28 wide on a wheel 200 across. It takes the colours of the profile on
screen when that is one of the other profiles, and greys while the profile with the balance is on screen: base
`#9aa3ae`, over a light grey `#e2e6eb` (not a colour the colour rule would give), so the dimmed rest, the base and the
over lap are three clearly different greys, dark, middle and light, ("Each profile carries its colours"); a report draws
it in the grey. Used hours fill the ring clockwise from 12 o'clock in the base colour; the unused rest is dimmed. Hours
over the ceiling are in the over colour: a second lap from 12 o'clock, drawn over the base colour on the same ring. That
lap is what carries into the next month, where those hours come first, from 12 o'clock, in the base colour. The ring is
a timeline: the month's hours sit on it in the order they were worked (by when the work happened, not when it was
entered), and every piece stays where it was worked. The pieces worked by the profile on screen are lit, in its base
colour; all the others are faded, whoever worked them: the same hue with 45% of its chroma taken away and its lightness
moved 20% of the way toward the panel's background, in OKLCH, so neighbouring pieces by different other profiles read as
one faded stretch. Switching profile moves nothing: it changes the colours and which pieces are lit. A new session grows
at the end of the used part; an entry written or corrected for an earlier day lands at its place in time. Past the
ceiling the same order goes on in the over lap, lit pieces in the over colour and the rest in the over colour faded; an
entry that crosses the ceiling splits there. Carried hours are lit for the profile that worked them. The grey wheel is
one grey, with nothing lit or faded. While the pointer rests on the ring's band (not its corners or its middle), the
over lap winds back to 12 o'clock in 0.3 s and the first lap shows whole; when the pointer leaves, it winds forward
again (both at once when the system asks for reduced motion). Up to the ceiling the centre number is in the base colour;
past it, it takes the over colour, as the flex bar's number does past 0. Either way it is at full strength whoever
worked the hours. While the over lap is wound back the number is in the base colour, and takes the over colour again
when the lap returns; the ring keeps its colours. Under the ceiling there is no lap to wind back, and the pointer on the
band changes nothing. The wheel's numbers never depend on its colours: switching profile changes only how it looks.

**Why:** the over lap shows the excess the moment it happens, and a full ring always means the ceiling; one ring reads
at a glance. The number turns with the over lap, so the over colour means only "over", on the wheel as on the bar, and
the two numbers follow one rule. Being always at full strength, the number is the sample to read the ring against:
pieces paler than the number were worked by another profile, in the base colour as in the over lap. The wheel sums all
the other profiles, so its colour says which of them is on screen, and the lit pieces say which of the hours are its
own, since the profiles may have different rates; a timeline keeps every hour in one place, so nothing jumps when the
profile changes. The wheel could be modelled without the pieces; they add a glance at which profile did the work, and
distract little. Fading inside the colour's own hue reads as the same colour, quieter. The over lap hides the first
hours of the ring, and winding it back shows them with no control added to the screen; the number follows to the base
colour, so it stays the sample for what the ring shows, and the over colour returns with the lap. Only the band starts
it, so passing near the wheel does not. With the balance profile on screen, none is, hence greys that sit on both
themes' panels; the light grey keeps "over" readable without a colour that belongs to no profile.

**Rejected:** the excess as a thinner second ring inside: two rings to read for one figure. Shrinking the ring so the
used and the excess share it: a full ring would stop meaning the ceiling. The number in the over colour (or amber) from
90% of the ceiling: going over costs nothing, so a warning before it is only an effect; between 90% and 100% the number
would stop being the sample unless the band were hovered, and the peek would need a case of its own. Colours of the
wheel's own, set per machine: the colours belong to the profiles. The wheel in segments, each in its own profile's
colour: more than the owner needs, and the wheel would stop being the colour of the profile on screen. The profile on
screen's hours gathered into one piece from 12 o'clock: the other pieces would be pushed along at every switch. Fading
by mixing toward the panel's background: on the blue panel the faded tone read as a second colour. A slider to wind the
wheel back: a permanent control for something wanted a few times a month. The peek at the interface's transition time
(0.2 seconds): tried, and the owner found it better at its own 0.3 s. Keeping the last other profile's colours while the
balance profile is on screen: the wheel would seem to belong to a profile that is not chosen.

**Revisit if:** a month goes more than a whole ceiling over, which one lap cannot show.

**Cases:**

- Ceiling 42 h, 21 h used: half the ring in the base colour, half dimmed; the number in the base colour.
- Ceiling 42 h, 38 h used: the number in the base colour; the ring has no over lap. The pointer on the band: nothing
  changes.
- Ceiling 42 h, 42 h used: the ring full in the base colour, no over lap, the number in the base colour.
- Ceiling 42 h, 46 h used: the ring full, with the over colour over 4/42 of it from 12 o'clock; the next month starts
  with 4 h in the base colour.
- Profiles A, B and C, an empty wheel, sessions of 2 h. A works: 0–2 lit. Switch to B: 0–2 faded. B works: 0–2 faded,
  2–4 lit. Switch to C: 0–4 faded. C works: 0–4 faded, 4–6 lit. Switch to A: 0–2 lit, 2–6 faded. A works: 0–2 lit, 2–6
  faded, 6–8 lit.
- Ceiling 42 h, 41 h used, A works 2 h: 41–42 lit in the base colour, the over lap's first hour lit in the over colour.
  Switch to B: both pieces faded.
- Ceiling 42 h, 46 h used, the pointer on the ring's band: the over lap is gone and the first lap shows whole, lit and
  faded as worked; the number reads 46:00 in the base colour. The pointer leaves: the over lap is back and the number is
  in the over colour.
- The pointer in the wheel's middle, or in a corner of its square: nothing winds back.
- 46 h used, the over hours all worked by A, B on screen: the over lap is faded and the number is in B's over colour at
  full strength.
- A faded piece of base `#7368d4` on the dark panel has the base's hue, 55% of its chroma, and a lightness a fifth of
  the way toward the panel's.
- Utveckling (blue) on screen: the wheel is blue; Vaktmästare on screen: the wheel is grey `#9aa3ae` with a light grey
  `#e2e6eb` over the ceiling; the hours are the same in both.
