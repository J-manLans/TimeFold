# Glossary

The project's terms, in alphabetical order. Use them as written here, and add a term when it is coined. Reasons stay
out (they are decisions), and so does state.

**Added break.** A length of time taken off a running entry when the owner is back, for unplanned time away during it.
It holds its length and the day it was added, and comes off the entry's time on that day first, then the day before.

**Balance.** For a profile with expected hours (only janitor work), the running sum of each day's hours minus the
expected hours.
Positive: hours to take out. Negative: hours to work in.

**Base colour.** A profile's main colour: the figures' colour for hours used and for minus; a nuance of the profile's
hue, picked in the profile's row.

**Case.** A concrete example agreed with the owner, given this, expect that, waiting under its decision until it
becomes a test.

**Ceiling.** The hours all profiles without expected hours may add up to together, over a month: full time minus
janitor's expected hours, for each weekday of the month. Hours over it carry into the next month. Never owed.

**Ceiling wheel.** The main screen's figure for the ceiling: a ring that fills as the month's hours are used, in the
colours of the profile on screen (grey for the balance profile), with hours over it in the over colour; a timeline of
the month's hours, the profile on screen's lit and the others' faded ("The ceiling wheel", in `design-decisions/`).

**Controls side.** The left side of the main screen: the start/stop button, the profile button, the status line,
"Lägg till paus" and the menu. What the owner presses.

**Dashboard.** The right side of the main screen, a dark or slate-blue panel: the balance, the flex bar, the ceiling
wheel, the pay estimate and the recent entries. What the owner reads.

**Day total.** The time worked on one calendar day, midnight to midnight, minus added breaks. What a day adds to the
balance, and what the day's result shows at stop.

**Design token.** A named value of the look, such as a colour, size or time, kept in one file and used by name
("Design tokens hold every value of the look").

**Entry.** One stretch of work, from a start to a stop. Clicked in the app, or written by hand.

**Entry line.** An entry opened for editing: a line centred on the entry, a handle at each end, zooming out as a
handle is dragged so the whole entry stays in view; other entries and midnight stop the handles.

**Errand.** Time away during the work day that is not work. Recorded as the gap between a stop and the next start, as
an added break, or afterwards as a gap cut on the entry line.

**Expected hours.** The hours the owner is expected to work on a given day ("Expected hours: 6 a day, Monday to
Friday", in `design-decisions/`).

**Faded.** On the ceiling wheel, the tone of hours worked by another profile than the one on screen: the base or over
colour in the same hue, weaker and a little toward the panel's background. Not the dimmed colour, which is the unused
part ("The ceiling wheel", in `design-decisions/`). See **Lit**.

**Flex bar.** The main screen's figure for the balance: a horizontal bar either side of a zero line, with the
balance as a number ("The flex bar", in `design-decisions/`).

**Flex day.** A whole day off paid for with the balance: it takes the expected hours off the balance. Not annual
leave, which is left empty.

**Full time.** The hours of a full working day (8), a setting; janitor's expected hours and the ceiling divide it.

**Gap.** The time between a stop and the next start, or cut from an entry on the entry line. Not work; it counts on
no day.

**Handover.** Moving the record from one of the owner's machines to the other: export one file on the first, import
it on the second, replacing everything there.

**Hue (a profile's).** Where the hue strip of the profile's colour picker sits; the base colour is a nuance of it and
the over colour its opposite ("Each profile carries its colours", in `design-decisions/`).

**Lit.** On the ceiling wheel, hours worked by the profile on screen, in its base or over colour at full strength.
See **Faded**.

**Month.** The app's counting month, from the set month start day (default the 1st) to the day before it in the
next month; the ceiling, reports and pruning count by it.

**Neon.** A hue at its most vivid: the colour on the picker's hue strip.

**Opening figures.** The janitor balance and the ceiling hours used, typed in when the app starts fresh; kept as
entries dated the first day.

**Over colour.** A profile's colour for "more than expected": hours over the ceiling, a plus balance, and the
numbers that show them; the opposite of the profile's hue at its most vivid, never picked.

**Pay category.** A label on a profile for how its hours are paid, so reports can group them. A label only.

**Pay estimate.** A rough figure of the month's pay: salaries plus hours times rates, for the owner only; never in the
report.

**Peek.** Resting the pointer on the ceiling wheel's band, which winds the over lap back so the first lap shows whole.

**Profile.** A label on an entry for the kind of work it is, such as janitor work or the development group. Profiles
are isolated; only one with expected hours has a balance.

**Prune.** Removing the record's oldest whole months, past three years, on the owner's yes; the balance and ceiling
hours at the cut become opening figures.

**Report.** A period's record, exported from the app for the owner to send to their boss.
