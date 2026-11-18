# Recording

How work and time away are recorded: the controls and breaks. Each decision follows the template in `README.md`, and is
cited by its title.

## One start/stop button and a profile list (2026-11-14)

**Built by:** Profiles, for the profile list and the warning label.

**Decision:** the main control is one button: "Starta jobb", which becomes "Stoppa jobb" while an entry of the profile
on screen runs. Beside it is a profile button that opens the list of profiles. Picking a profile changes only which
profile is on screen; a running entry goes on. Pressing start on the profile on screen ends the running entry, if any,
at that moment and starts one on that profile, so at most one entry runs at a time. While another profile's entry runs,
a small custom label says what pressing it will stop ("stoppar A"), on a slightly see-through dark background edged in
that profile's colour: it fades in at once when the pointer enters the button, follows the pointer while it is over it,
to its right and centred on its height, and fades out where it stood when it leaves; with keyboard focus it shows under
the button. The same tip explains other buttons, such as the undo ("Ångra: stopp 15:40") and the onboarding's
"Importera" ("från fil"). The running profile is shown. The button never changes size: "Starta jobb" and "Stoppa jobb"
fit the same width. A forgotten switch back is corrected by hand. The totals, the flex bar and the ceiling wheel update
when an entry stops; nothing ticks while it runs, and the update at stop is the visual effect.

**Why:** one running entry is the simplest record, and it is how common time trackers work. A break needs no control of
its own ("Time away is a gap or an added break").

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
- While an entry runs, the flex bar and the ceiling wheel do not change; at stop they include it.

## The app opens on the running profile, or the last one on screen (2026-11-16)

**Built by:** Profiles.

**Decision:** the app opens on the profile whose entry is running. When nothing runs, it opens on the profile that was
on screen when it closed, kept in the machine's own settings file beside the theme; when that profile is archived or
gone, or nothing is kept yet, it opens on the first profile.

**Why:** opening where the clock is going makes the app feel alive. When nothing runs, the owner comes back to where
they left off: stopped for a break on the development group, they reopen on it. The profile on screen belongs to the
machine, like the theme, so it stays out of the record and the handover.

**Rejected:** always the first profile when nothing runs: simpler, as nothing is kept, but after a break on another
profile it means a click to get back. Always the last one on screen, even while another runs: the status line already
shows what runs, but opening on the running profile is what the owner expects.

**Revisit if:** opening on the running profile surprises more often than it helps.

**Cases:**

- A running at close, B on screen: it opens on A.
- Nothing running, B on screen at close: it opens on B.
- Nothing running, B on screen at close, B archived on the other machine and handed over: it opens on the first profile.
- A first start: it opens on the first profile.

## The last click can be undone for a few seconds (2026-11-15)

**Decision:** a round undo button sits beside "Lägg till paus", the two centred together under the button block, drawn
like the profile button's disc in its dent with a turning-back arrow. It is faded out when there is nothing to undo, and
eases between faded and awake in 0.2 seconds rather than snapping. After a start or a stop it wakes for 15 seconds: an
afterglow in the profile's neon lies over the disc only, not the dent around it, under the arrow, starting at about two
thirds strength, so the disc's own sheen shows through, and fading evenly to nothing over that time; hovered, the
pointer-following label says what it would undo ("Ångra: stopp 15:40"). Pressing it reverses exactly that click: an
undone start removes the entry it created; an undone stop lets the entry run on as if never stopped; an undone switch
("Starta jobb" on one profile while another runs) reverses both halves, removing the new entry and letting the old one
run on. Only the latest click can be undone, and only within its 15 seconds. An undone click leaves no mark in the
record ("Entries remember how they were made"); after that, changes go through editing as usual.

**Why:** one click makes a mis-click easy, and putting it right should be one click too, not a trip to the editor. A
slip caught within seconds is not a correction of the record, so it leaves no trace; a later change is, and is marked.
The time limit also keeps a stray click hours later from undoing something long forgotten. The fading afterglow shows
that the undo is there, whose click it is and how long it lasts, without text and without the button changing shape; the
arrow stays clear on top. A slip is noticed within seconds, so 15 are enough.

**Rejected:** an undo history: the latest click is the one that slips. Asking to confirm each click: it would break "one
click to start or stop". Undo without a time limit: an old click is a correction and belongs on the entry's line. A thin
ring draining around the disc: a separate drawing to keep in step with the disc, three numbers for one setting. A
curtain sinking over the disc: the shrinking circle keeps its round shape. An afterglow shrinking into the centre, over
the arrow or under it: it did not feel right in motion. A fill under the arrow shrinking by area, driven frame by frame
from a script: its end collapsed quickly and it ran less smoothly than an animation the compositor runs. An undo line in
the status line's place: a disc beside "Lägg till paus" keeps the status line for what runs, and pairs the two quiet
controls.

**Revisit if:** 15 seconds proves too short or too long in daily use.

**Cases:**

- Stop at 15:40, nothing done until 15:40:30: the undo button is faded again; the stop stays.
- Nothing clicked since the app opened: the undo button is faded.
- Stop at 15:40, the window hidden at once and shown again at 15:41: the undo is faded and a press does nothing; the
  undo's time is a deadline, not a timer the system may delay.
- Stop at 15:40, the app closed and opened again at 15:40:05: the undo is faded; the last click lives only in the
  running app, never in the record.

## A running entry from an earlier day asks (2026-11-18)

**Built by:** Clocking; the case of another profile on screen, Profiles.

**Decision:** nothing stops an entry by itself. During the day, the stop click is the only signal of when work ended.
When the app opens on a later date than a still-running entry started, it says so ("Work has been running since
yesterday 21:30") in a popup centred on the controls side, so the figures stay in view, with a line saying that if it is
a mistake, press Stoppa and correct the entry ("Editing an entry on its line"). It offers two answers: **Stoppa** stops
the running entry as the start/stop button does, undo included, whichever profile is on screen; **Fortfarande igång**
closes the popup and the entry runs on. Nothing is remembered: the next opening on a later date asks again. The check is
made only when the app opens, never while it runs. The popup's words are settled when it is drawn in the prototype.

**Why:** late work from home can cross midnight, so a running entry is not always a mistake; but usually it is, and the
owner should hear of it at once, not find it in the report. Opening is the one moment the app can tell without guessing:
while it runs, it cannot know whether the owner is still there, and asking at the first click after midnight would
interrupt real night work. Stoppa is the true answer when work has just ended; when the entry was forgotten, it is put
right where every mistake is, on its line, not on a screen of its own. Reusing the button's stop brings its undo along.

**Rejected:** stopping the entry at midnight: it records an end that is false but looks believable, and the app may not
be running at midnight. Doing nothing until a correction: the mistake surfaces too late. "Jag slutade …" with a time,
from a clock picker or typed: a second way to correct an entry, beside the line that already does it. Asking also while
the app runs, at the first click on a later date: it guesses whether the owner is there. Remembering "Fortfarande igång"
until the next change of date: an opening asks once, so there is nothing to remember. A notice also when stopping an
entry from an earlier day: it guards against a slip the owner sees in the list anyway.

**Revisit if:** a forgotten entry, with the app left open overnight, slips through unnoticed.

**Cases:**

- Entry started yesterday 21:30 and running, app opened today: the popup shows.
- Stoppa at 07:00: the entry is 21:30–07:00, stopped as by the button; undo makes it run again from 21:30.
- Fortfarande igång: the entry runs on; closing and opening the app again today shows the popup again.
- Entry started today and running: no popup.
- App left open across midnight, clicked at 07:00: no popup.
- Another profile on screen (Profiles): Stoppa stops the running entry, and the profile on screen stays.

## Time away is a gap or an added break (2026-11-14)

**Built by:** Breaks and flex days, for the added break.

**Decision:** time away is recorded in one of two ways, and both count on the day it happens ("Time counts on the day it
was worked"). A planned break is a stop and a later start: the gap between them is not work, and falls on whichever day
it falls on. Time away that happens during a running entry, unplanned (such as own errands slipped into a work errand),
is an **added break**: a length of time taken off an entry, added when back, with a quiet "add break" control. An added
break holds its length and the day it was added, not when it happened. It comes off its entry's time on that day first,
and any rest off the entry's time on the day before, since midnight only cuts the counting, not the stretch. It goes to
the running entry of the profile on screen. The control is always shown, so the app always shows what it can do; it is
active only while that entry runs, and greyed out otherwise. A break found after the entry has stopped is an edit on the
entry's line ("Editing an entry on its line"). It cannot be longer than its whole entry. The five most recent entries,
whatever their day, are listed under the flex bar and the ceiling wheel, with their added breaks as small tags among
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
- Stop Tuesday 23:30, start Wednesday 00:15: the gap counts on neither day, with no special rule; Tuesday ends at 23:30,
  Wednesday starts at 00:15.
- A break changed from 45 to 35 min: the entry's worked time grows by 10 min.

## Entering a length of time (2026-11-14)

**Built by:** Breaks and flex days.

**Decision:** a length of time, such as an added break, is typed into one field: a plain number is minutes ("45"), and
hours and minutes are written "1:20". Only digits and `:` are taken, and only in that shape: up to three digits of
minutes alone, or two of hours and two of minutes, the minutes at most 59; a sign, a letter or a keystroke that breaks
the shape does not appear. The empty field shows "00:00". While typing, how it reads the input shows just under the
field ("1h 20min"), so the field itself stays where it is. Every length the app writes in words is written this way, the
unit against its number: "5min", "23h 20min", "paus 20min", "+20h". Enter confirms; Esc, or clicking away, cancels. The
field has no buttons. The clock picker is for times of day only.

**Why:** one short field is the least fuss, and "1:20" is how the owner writes a length in Excel. Showing the reading
catches a hasty mistake before it is saved.

**Rejected:** separate hour and minute fields: more to fill in. "Lägg till" and "Avbryt" buttons beside the field: Enter
and Esc do the same with less on screen. The clock picker: it picks a time of day, not a length.

**Revisit if:** typed lengths are often misread.

**Cases:**

- "45": 45 min.
- "1:20": 80 min, shown as "1h 20min".
- "5", "05" and "0:05": 5 min, shown as "5min".
- "-5" or "1h": the sign and the letter do not appear. "1:205": the third minute digit does not appear. "1:7": the 7
  does not appear.
