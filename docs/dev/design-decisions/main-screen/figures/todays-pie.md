# Main screen: today's pie

How today is going for the profile with the balance, beside the status line. Each decision follows the template in
`../../README.md`, and is cited by its title.

## Today's pie (2026-11-18)

**Decision:** a small ring of slices beside the status line, right of its text, the two one row centred under the button
block, which keeps the pie's room so nothing below moves when it shows, shows how today is going for the profile with
the balance, while an entry of it runs: one slice per hour it is expected to work today (six for 6 h), the expected time
divided evenly among them when it is not whole hours (6:30 is seven slices of 55:43), round like a health bar, each
slice a segment of a ring with its middle open, a small even gap between slices. An empty slice is marked by its border
in the profile's base colour; a slice fills in the base colour as its share is worked, the last one filling when the
day's expected hours are reached. Past them the next lap fills over the last, slice by slice, as the ceiling wheel's
over lap lies over its ring: the second in the neon, a third in the base again, and so on by turns, so the colour
growing is always the new lap. A slice clicks in whole and lights as it does, as a new entry's row lights and fades, all
but one: the slice filling at the end of a lap grows in thirds, with no gaps or borders inside it, its fill ending
straight where it stops. On the first lap that is always the last slice, whatever the expected hours, so the end of the
day reads closer; on later laps it is the slice filling now. Unlike every other figure it is live, counted again once a
minute, with no motion but the click. When nothing runs, or another profile does, it does not show, as the status line's
text does not. The dashboard still changes only at stop, with its counting animation. On a day with no expected hours
the pie does not show. It has no text: the slices are the reading. The values (in `design-tokens.css`, from the sketch
as the owner set it): 40 px across, 10 px from the text, the ring's middle open to 30% of its radius, a border of 2.5
and a gap of 6 in the pie's own units, 100 across, and three parts, 20 minutes each in a 6-hour day.

**Why:** the owner sometimes sits at the desk for a few hours with the app on the second screen; a glance should say how
much of today is left, or how far over it is, without a word to read. The pie means today, while the flex bar and the
wheel mean where the owner stands overall, so the pie moving while they wait for the stop says they mean different
things, and keeps the stop's animation the moment the totals move. Whole slices read like a health bar, counted at a
glance from across the room, and a slice clicking in has the app's mechanical feel. Only the profile with the balance
has a daily target; the others have the month's ceiling, which the wheel shows. A ring, beside the wheel's band, keeps
its slices broad where they are read.

**Rejected:** a line of text, "Idag 3:52 av 6:00": words to read, where the slices are seen. Pizza slices meeting at the
centre: thin at the middle where they are hardest to read. Slices that fill smoothly with no borders or flash: the
moment an hour completes passes silently, and an unmarked pie reads only by its size. A slice that fills by the minute:
a live fill, where whole slices and thirds at the end are enough. Gaps and borders between the thirds: they cut the last
slice into three small slices, where it is one slice filling. The last stretch as a share of the circle, rather than the
last slice: the pie would split differently with each day's expected hours. The neon capped at one lap: a long overtime
on a short day would have nowhere to show. The balance and the wheel counting live too: the dashboard's animation at
stop would be lost. The empty slices' borders in the neon: the neon would mean both "not yet" and "too much" in one
small pie, and six hot outlines all day.

**Revisit if:** a whole-hour reading leaves the owner unsure how much is left, or the pie crowds the narrow window.

**Cases:**

- Expected 6 h, 3:52 worked today: three slices filled, three marked empty.
- Work running since 08:00, 11:05: three slices filled; at 12:00 the fourth clicks in and lights.
- 5:20 worked of 6 h: five slices full, the sixth a third filled.
- 7:20 worked of 6 h: the first slice in the neon, the second with a third of neon over its base, the rest in the base.
- 5 h worked of 2 h: two slices; the third lap, in the base again, has filled the first over the second lap's neon.
- Saturday, no expected hours: no pie.
- Nothing running, or the development group running: no pie.
- Expected 6:30: seven slices, the third filling at 2:48.
- Yesterday's work and the part before midnight of an entry across it: not today's slices.
