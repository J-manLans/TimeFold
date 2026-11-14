# Recording

How work and time away are recorded: the controls and breaks. Each decision follows
the template in `README.md`, and is cited by its title.

## One start/stop button and a profile list (2026-11-14)

**Built by:** Clocking for the button; Profiles for the profile list.

**Decision:** the main control is one button: "Start work", which becomes "Stop work" while an entry runs. Beside it
is the list of profiles. Picking a profile changes only which profile is on screen; a running entry goes on. Pressing
start on the profile on screen ends the running entry, if any, at that moment and starts one on that profile, so at
most one entry runs at a time. While another profile's entry runs, the button says what it will do (such as "Start B
(stops A)"), and the running profile is shown. A forgotten switch back is corrected by hand. The totals and bars
update when an entry stops; nothing ticks while it runs, and the update at stop is the visual effect.
**Why:** one running entry is the simplest record, and it is how common time trackers work. A break needs no control
of its own ("Time away is a gap or an added break").
**Rejected:** four buttons per profile (start day, end day, start break, end break), with a profile left on a break
while another runs: each profile needed a paused day, and a date check to close it. A running clock: the owner
prefers the whole update at stop.
**Revisit if:** the owner often needs two profiles running at once.
**Cases:**
- A running, B picked: A still runs, and nothing is recorded.
- A running, start pressed on B at 13:00: A ends at 13:00, B starts at 13:00.
- A on screen and running, stop pressed: A ends; nothing runs.
- While an entry runs, the bars do not change; at stop they include it.

## A running entry from an earlier day asks (2026-11-14)

**Built by:** Clocking.

**Decision:** nothing stops an entry by itself. During the day, the stop click is the only signal of when work ended.
When the app is opened or clicked on a later date than a still-running entry started, it says so ("Work has been
running since yesterday 21:30") and asks: **Still working**, and the entry goes on, or **I stopped at…**, and the
clock sets its end.
**Why:** late work from home can cross midnight, so a running entry is not always a mistake; but usually it is, and
the owner should hear of it at once, not find it in the report. It is also a reminder to go to bed.
**Rejected:** stopping the entry at midnight: it records an end that is false but looks believable, and the app may
not be running at midnight. Doing nothing until a correction: the mistake surfaces too late.
**Revisit if:** the question comes up for days that were really worked through the night.
**Cases:**
- Entry started yesterday 21:30 and running, app opened today: the question is asked.
- Answer "I stopped at 23:10": the entry ends yesterday at 23:10.
- Answer "Still working": the entry runs on; the question comes again only at the next change of date.
- Entry started today and running: no question.

## Time away is a gap or an added break (2026-11-14)

**Built by:** Clocking for the gap; Breaks and flex days for the added break.

**Decision:** a planned break is a stop and a later start; the gap between them is not work. Time
away that happens during a running entry, unplanned (such as own errands slipped into a work errand), is an
**added break**: a length of time taken off an entry, added afterwards with a quiet "add break" control. An added
break holds only its length, not when it happened. It goes to the last entry started today on the profile on screen,
running or stopped; when there is none, the control is greyed out. It cannot be longer than its entry. Today's
entries are listed under the bars, with today's added breaks as small tags among them; clicking a tag opens the same
length field with the number in it, to change or remove.
**Why:** the owner's errands are often unplanned and noted afterwards, as in the Excel file today. The totals need only
the length. A hasty mistake must be fixed where it is seen, not dug out of an editor.
**Rejected:** start-break and end-break clicks: a stop and a start do the same with no new control, and an unplanned
break cannot be clicked as it happens. Recording when an added break happened: nothing uses it. Adding a break to an
earlier day from this control: that is a correction.
**Revisit if:** the report needs breaks shown by time or kind.
**Cases:**
- Entry 08:00–12:00 with a 45 min added break: 3 h 15 min.
- Profile on screen has no entry started today: "add break" is greyed out.
- A running, B on screen with a stopped entry from today: the break goes to B's entry.
- A 5 h break on a 2 h entry: refused.
- A break changed from 45 to 35 min: the entry's worked time grows by 10 min.

## Entering a length of time (2026-11-14)

**Built by:** Breaks and flex days.

**Decision:** a length of time, such as an added break, is typed into one field: a plain number is minutes ("45"), and
hours and minutes are written "1:20". While typing, the field shows how it reads the input ("1 h 20 min"). The clock
picker is for times of day only.
**Why:** one short field is the least fuss, and "1:20" is how the owner writes a length in Excel. Showing the reading
catches a hasty mistake before it is saved.
**Rejected:** separate hour and minute fields: more to fill in. The clock picker: it picks a time of day, not a length.
**Revisit if:** typed lengths are often misread.
**Cases:**
- "45": 45 min.
- "1:20": 80 min, shown as "1 h 20 min".
- "5", "05" and "0:05": 5 min.
