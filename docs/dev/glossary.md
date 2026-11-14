# Glossary

The project's terms, in alphabetical order. Use them as written here, and add a term when it is coined. Reasons stay
out (they are decisions), and so does state.

**Added break.** A length of time taken off a running entry when the owner is back, for unplanned time away during it.
It holds its length and the day it was added, and comes off the entry's time on that day first, then the day before.

**Balance.** For a profile with expected hours (only janitor work), the running sum of each day's hours minus the
expected hours.
Positive: hours to take out. Negative: hours to work in.

**Balance bar.** The main screen's figure for the balance: a horizontal bar either side of a zero line, with the
balance as a number.

**Base colour.** The ceiling wheel's colour for hours used, a setting.

**Case.** A concrete example agreed with the owner, given this, expect that, waiting under its decision until it
becomes a test.

**Ceiling.** The hours all profiles without expected hours may add up to together, over a month: full time minus
janitor's expected hours, for each weekday of the month. Hours over it carry into the next month. Never owed.

**Ceiling wheel.** The main screen's figure for the ceiling: a ring that fills in the base colour as the month's
hours are used, with hours over it in the over colour ("The ceiling wheel", in `design-decisions/`).

**Day total.** The time worked on one calendar day, midnight to midnight, minus added breaks. What a day adds to the
balance, and what the day's result shows at stop.

**Entry.** One stretch of work, from a start to a stop. Clicked in the app, or written by hand.

**Entry line.** An entry opened for editing: a line centred on the entry, a handle at each end, zooming out as a
handle is dragged so the whole entry stays in view; other entries and midnight stop the handles.

**Errand.** Time away during the work day that is not work. Recorded as the gap between a stop and the next start, as
an added break, or afterwards as a gap cut on the entry line.

**Expected hours.** The hours the owner is expected to work on a given day ("Expected hours: 6 a day, Monday to
Friday", in `design-decisions/`).

**Flex day.** A whole day off paid for with the balance: it takes the expected hours off the balance. Not annual
leave, which is left empty.

**Full time.** The hours of a full working day (8), a setting; janitor's expected hours and the ceiling divide it.

**Gap.** The time between a stop and the next start, or cut from an entry on the entry line. Not work; it counts on
no day.

**Handover.** Moving the record from one of the owner's machines to the other: export one file on the first, import
it on the second, replacing everything there.

**Over colour.** The ceiling wheel's colour for hours over the ceiling; suggested from the base colour, or picked.

**Part.** A piece of the app named on the roadmap before the phases are agreed, such as Clocking or Handover.
At the end of Phase 0 the parts are ordered into phases.

**Pay category.** A label on a profile for how its hours are paid, so reports can group them. A label only.

**Pay estimate.** A rough total of hours times each profile's rate, for the owner only; never in the report.

**Profile.** A label on an entry for the kind of work it is, such as janitor work or the development group. Profiles
are isolated; only one with expected hours has a balance.

**Report.** A period's record, exported from the app for the owner to send to their boss.
