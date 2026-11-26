# Glossary: A–E

Terms A–E, in alphabetical order. The index and the rules for terms are in `README.md`.

**Added break.** A length of time taken off a running entry when the owner is back, for unplanned time away during it.
An entry holds one, its length alone; across midnight it comes off the entry's last day first, then the day before.

**Afterglow.** On the undo button, the glow in the profile on screen's neon that lies over the disc after a start or a
stop and fades to nothing while the click can be undone ("The last click can be undone for a few seconds").

**Archived profile.** A profile with hours taken out of use: gone from the switch list and the Profiler list, kept with
its hours, and listed under "Arkiverade" until "Återställ" brings it back. A profile with no hours is deleted instead
("A profile with hours is archived, one without is deleted", in `design-decisions/`).

**Balance.** For a profile with expected hours (only janitor work), the running sum of each day's hours minus the
expected hours. Positive: hours to take out. Negative: hours to work in. On the main screen it also counts flex days
marked ahead; a report counts only the days up to its end.

**Base colour.** A profile's main colour: the figures' colour for hours used and for minus; the profile's hue muted,
never picked; only the hue is.

**Case.** A concrete example agreed with the owner, given this, expect that, waiting under its decision until it becomes
a test.

**Ceiling.** The hours all profiles without expected hours may add up to together, over a month: full time minus
janitor's expected hours, for each weekday of the month. Each month counts only its own hours; nothing carries. Never
owed.

**Ceiling trend.** The sum of each finished month's hours over or under its ceiling, since the ceiling last changed,
shown as signed hours beside the pay estimate ("The ceiling's trend", in `design-decisions/`). Never owed.

**Ceiling wheel.** The main screen's figure for the ceiling: a ring that fills as the month's hours are used, in the
colours of the profile on screen (grey for the balance profile), with hours over it in the neon; a timeline of the
month's hours, the profile on screen's lit and the others' faded ("The ceiling wheel", in `design-decisions/`).

**Controls side.** The left side of the main screen: the start/stop button, the profile button, the status line, "Lägg
till paus" and the menu. What the owner presses.

**Coming value.** A setting saved for a later day, shown as a quiet note under the value in force until its day, when it
takes over; its "×" takes it back ("The menu has tabs, with every value locked behind "Ändra"", in `design-decisions/`).

**Daily copy.** The record as it stood when the app started on a day, kept in `copies/` beside it once it has passed the
check, unless it is the same as the newest; the last 31 are kept. What the **Recovery screen** offers.

**Dashboard.** The right side of the main screen, a dark or slate-blue panel: the balance, the flex bar, the ceiling
wheel, the pay estimate and the recent entries. What the owner reads.

**Day total.** The time worked on one calendar day, midnight to midnight, minus added breaks. What a day adds to the
balance, and what the day's result shows at stop.

**Design token.** A named value of the look, such as a colour, size or time, kept in one file and used by name ("Design
tokens hold every value of the look").

**Dimmed colour.** A profile's base colour faded toward the panel it sits on: the unused part of a figure, such as the
flex bar's track. Worked out, never picked ("Each profile carries its colours"). Not **Faded**.

**Docking.** On the entry line, a handle dragged onto the neighbouring entry of the same profile, which joins the two on
confirm. Docked, the neighbour is outlined; let go there, it is **taken in**: part of the entry's bar, the handle at its
far end. Docked is only shown while a handle is held: at rest, an entry touching a neighbour of its profile has taken it
in.

**Entry.** One stretch of work, from a start to a stop. Clicked in the app, or written by hand.

**Entry line.** An entry opened for editing: a line centred on the entry, a handle at each end, its view holding still
while a handle is dragged and refitting after; other entries, now and the break stop the handles, and midnight does not.

**Errand.** Time away during the work day that is not work. Recorded as the gap between a stop and the next start, as an
added break, or afterwards as a gap cut on the entry line.

**Expected hours.** The hours the owner is expected to work on a given day ("Expected hours: 6 a day, Monday to Friday",
in `design-decisions/`).
