# Recording

How work and time away are recorded: the controls and breaks. Each decision follows
the template in `README.md`, and is cited by its title.

## One start/stop button and a profile list (2026-11-14)

**Built by:** Clocking for the button; Profiles for the profile list.

**Decision:** the main control is one button: "Starta jobb", which becomes "Stoppa jobb" while an entry of the profile
on screen runs. Beside it is a profile button that opens the list of profiles. Picking a profile changes only which
profile is on screen; a running entry goes on. Pressing start on the profile on screen ends the running entry, if any,
at that moment and starts one on that profile, so at most one entry runs at a time. While another profile's entry runs,
a small custom label says what pressing it will stop ("stoppar A"), on a slightly see-through dark background edged in
that profile's colour: it fades in at once when the pointer enters the button, follows the pointer while it is over it,
and fades out when it leaves; with keyboard focus it shows under the button. The running profile is shown. The button
never changes size: "Starta jobb" and "Stoppa jobb" fit the same width. A forgotten switch back is corrected by hand.
The totals, the balance bar and the ceiling wheel update when an entry stops; nothing ticks while it runs, and the
update at stop is the visual effect.
**Why:** one running entry is the simplest record, and it is how common time trackers work. A break needs no control
of its own ("Time away is a gap or an added break").
**Rejected:** four buttons per profile (start day, end day, start break, end break), with a profile left on a break
while another runs: each profile needed a paused day, and a date check to close it. A running clock: the owner prefers
the whole update at stop. A line inside the button saying what start will stop: it crowded the button. The system's own
tooltip: it comes late and stands still, where the custom label is there as the pointer arrives. A button that grows to
show the warning: the click target would move under the pointer.
**Revisit if:** the owner often needs two profiles running at once.
**Cases:**
- A running, B picked: A still runs, and nothing is recorded.
- A running, start pressed on B at 13:00: A ends at 13:00, B starts at 13:00.
- A on screen and running, stop pressed: A ends; nothing runs.
- A running, B on screen, pointer enters the button: "stoppar A" shows at once by the pointer and follows it; the
  pointer leaves: it goes.
- "Starta jobb" and "Stoppa jobb": the button has the same size in both.
- While an entry runs, the balance bar and the ceiling wheel do not change; at stop they include it.

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

**Decision:** time away is recorded in one of two ways, and both count on the day it happens ("Time counts on the day it
was worked"). A planned break is a stop and a later start: the gap between them is not work, and falls on whichever day
it falls on. Time away that happens during a running entry, unplanned (such as own errands slipped into a work errand),
is an **added break**: a length of time taken off an entry, added when back, with a quiet "add break" control. An added
break holds its length and the day it was added, not when it happened. It comes off its entry's time on that day first,
and any rest off the entry's time on the day before, since midnight only cuts the counting, not the stretch. It goes to
the running entry of the profile on screen. The control is always shown, so the app always shows what it can do; it is
active only while that entry runs, and greyed out otherwise. A break found after the entry has stopped is an edit on the
entry's line ("Editing an entry on its line"). It cannot be longer than its whole entry. The five most recent entries,
whatever their day, are listed under the balance bar and the ceiling wheel, with their added breaks as small tags among
them, and "Visa alla" under the list opens the history; clicking a tag opens the same length field with the number in
it, to change or remove.
**Why:** the owner's errands are often unplanned, and the owner notes breaks during the day when back, as in the Excel
file today, so the day added places a break in the stretch it belongs to. An "add break" that stays active after stop
would make the owner wonder whether work is still running. A hasty mistake must be fixed where it is seen, not dug out
of an editor.
**Rejected:** start-break and end-break clicks: a stop and a start do the same with no new control, and an unplanned
break cannot be clicked as it happens. Recording when an added break happened: the day is enough. Splitting a running
entry into two stored entries at midnight: the running entry would restart each day, and the question for a running
entry from an earlier day would never be asked. Adding a break to a stopped entry from this control: it blurs whether
work is running, and the entry's line does it better.
**Revisit if:** the report needs breaks shown by time or kind.
**Cases:**
- Entry 08:00–12:00 with a 45 min added break: 3 h 15 min.
- Nothing running on the profile on screen: "add break" is shown, greyed out.
- A running, B on screen: "add break" is greyed out.
- A 5 h break on an entry that has run 2 h: refused.
- Entry Tuesday 22:00 to Wednesday 01:00, 30 min break added at 00:30 while it runs: Tuesday 2 h, Wednesday 30 min.
- Entry running since Tuesday 22:00, 45 min break added at Wednesday 00:20: Wednesday 0, Tuesday 1 h 35.
- Stop Tuesday 23:30, start Wednesday 00:15: the gap counts on neither day, with no special rule; Tuesday ends at
  23:30, Wednesday starts at 00:15.
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
