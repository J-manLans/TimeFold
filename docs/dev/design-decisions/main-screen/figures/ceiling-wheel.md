# Main screen: the ceiling wheel

The month's ceiling for the other work, as a ring. Each decision follows the template in `../../README.md`, and is cited
by its title.

## The ceiling wheel (2026-11-26)

**Decision:** the ceiling shows as a ring, the ceiling wheel, with the month's used hours as a number in its centre. A
full ring is the month's ceiling. It takes the colours of the profile on screen when that is one of the other profiles,
and greys while the profile with the balance is on screen (greys the colour rule would not give), so the dimmed rest,
the base and the over lap are three clearly different greys, dark, middle and light, ("Each profile carries its
colours"); a report draws it in the grey. Used hours fill the ring clockwise from 12 o'clock in the base colour; the
unused rest is dimmed. Hours over the ceiling are in the neon: a second lap from 12 o'clock, drawn over the base colour
on the same ring. The wheel holds only its own month's hours: nothing carries in from the month before ("The other
profiles share a ceiling"). The ring is a timeline: the month's hours sit on it in the order they were worked (by when
the work happened, not when it was entered), and every piece stays where it was worked. The pieces worked by the profile
on screen are lit, in its base colour; all the others are faded, whoever worked them (the faded colour, "Each profile
carries its colours"), so neighbouring pieces by different other profiles read as one faded stretch. Switching profile
moves nothing: it changes the colours and which pieces are lit. A new session grows at the end of the used part; an
entry written or corrected for an earlier day lands at its place in time. Past the ceiling the same order goes on in the
over lap, lit pieces in the neon and the rest in the neon faded; an entry that crosses the ceiling splits there. The
grey wheel is one grey, with nothing lit or faded. While the pointer rests on the ring's band (not its corners or its
middle), the over lap winds back to 12 o'clock, in a short time of its own, and the first lap shows whole; when the
pointer leaves, it winds forward again (both at once when motion is off, "Motion can be switched off in the app"). Up to
the ceiling the centre number is in the base colour; past it, it takes the neon, as the flex bar's number does past 0.
Either way it is at full strength whoever worked the hours. While the over lap is wound back the number is in the base
colour, and takes the neon again when the lap returns; the ring keeps its colours. Under the ceiling there is no lap to
wind back, and the pointer on the band changes nothing. A ceiling of 0 ("The other profiles share a ceiling") draws no
ring, since there is nothing to fill: the used hours stand alone as the number, in the neon, every one of them over, and
the pointer where the band would be changes nothing. The wheel's numbers never depend on its colours: switching profile
changes only how it looks.

**Why:** the over lap shows the excess the moment it happens, and a full ring always means the ceiling; one ring reads
at a glance. The number turns with the over lap, so the neon means only "over", on the wheel as on the bar, and the two
numbers follow one rule. Being always at full strength, the number is the sample to read the ring against: pieces paler
than the number were worked by another profile, in the base colour as in the over lap. The wheel sums all the other
profiles, so its colour says which of them is on screen, and the lit pieces say which of the hours are its own, since
the profiles may have different rates; a timeline keeps every hour in one place, so nothing jumps when the profile
changes. The wheel could be modelled without the pieces; they add a glance at which profile did the work, and distract
little. Fading inside the colour's own hue reads as the same colour, quieter. The over lap hides the first hours of the
ring, and winding it back shows them with no control added to the screen; the number follows to the base colour, so it
stays the sample for what the ring shows, and the neon returns with the lap. Only the band starts it, so passing near
the wheel does not. With the balance profile on screen, none is, hence greys that sit on both themes' panels; the light
grey keeps "over" readable without a colour that belongs to no profile.

**Rejected:** the excess as a thinner second ring inside: two rings to read for one figure. Shrinking the ring so the
used and the excess share it: a full ring would stop meaning the ceiling. The number in the neon (or amber) from 90% of
the ceiling: going over costs nothing, so a warning before it is only an effect; between 90% and 100% the number would
stop being the sample unless the band were hovered, and the peek would need a case of its own. Colours of the wheel's
own, set per machine: the colours belong to the profiles. The wheel in segments, each in its own profile's colour: more
than the owner needs, and the wheel would stop being the colour of the profile on screen. The profile on screen's hours
gathered into one piece from 12 o'clock: the other pieces would be pushed along at every switch. Fading by mixing toward
the panel's background: on the blue panel the faded tone read as a second colour. A slider to wind the wheel back: a
permanent control for something wanted a few times a month. The peek at the interface's transition time (0.2 seconds):
tried, and the owner found it better at its own 0.3 s. Keeping the last other profile's colours while the balance
profile is on screen: the wheel would seem to belong to a profile that is not chosen.

**Revisit if:** a month goes more than a whole ceiling over, which one lap cannot show.
