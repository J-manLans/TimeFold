# Time

How hours count: on which day, against expected hours, which days owe them, and what a month is. Each decision follows the template in
`README.md`, and is cited by its title.

## Expected hours: 6 a day, Monday to Friday (2026-11-14)

**Built by:** Clocking.

**Decision:** the owner's janitor work is expected to be 6 hours a day, Monday to Friday. The janitor balance is each
day's janitor hours minus 6, added up over time. The 6 is a setting, changed as in "Settings change from a date".
**Why:** it is the owner's working time as a janitor, and what the Excel file counts against today.
**Rejected:** none yet.
**Revisit if:** the owner's working time changes, or differs over the year.

## Time counts on the day it was worked (2026-11-14)

**Built by:** Clocking.

**Decision:** an entry is stored as one stretch, from its start to its stop, but its time is counted on the calendar
day it was worked: an entry across midnight is split there when counting. This holds for every profile. A profile
without a balance adds each day's hours to the shared ceiling over its period; a profile with a balance adds them as
in "A day owes its expected hours only when work started on it".
**Why:** the report and any working time limits go by calendar days, and an hour after midnight belongs to the next
day, and to the next month at a month's end. Storing one entry keeps corrections simple, and an added break still
lands on its day ("Time away is a gap or an added break").
**Rejected:** counting all of an entry's time on the day it started: simpler, but the record would not match the
calendar, and a period's edge would take hours from the wrong side.
**Revisit if:** the employer counts late work on the day it began.
**Cases:**
- Tuesday 22:00 to Wednesday 01:00: Tuesday 2 h, Wednesday 1 h.
- An entry of a profile without a balance, 31 March 23:00 to 1 April 01:00: 1 h in March's ceiling, 1 h in April's.

## A day owes its expected hours only when work started on it (2026-11-14)

**Built by:** Clocking for worked days; Breaks and flex days for flex days.

**Decision:** for a profile with a balance, each day adds the hours worked on it. A day is also charged its expected
hours only if one of the profile's entries started on it, or it is a flex day. A flex day, marked with one action for
a day or a range of days, takes off the full expected hours. Any other day owes nothing: weekends, public holidays,
annual leave and sick days are simply left empty, and the app never needs to know why. Hours that run past midnight
into such a day are added to it, and charge nothing. Hours taken out within a day need nothing special: a short day
lowers the balance by itself.
**Why:** it is how the owner's Excel file works today, proven in daily use, and it needs no calendar of holidays to
keep up to date. The flex day replaces the one thing that is awkward in Excel: typing a zero day for each day off.
Counting only days work started on keeps a late night from charging a day of leave.
**Rejected:** a calendar of expected working days (holidays, leave) that charges the expected hours unless a day is
excused: more to maintain, and wrong whenever the calendar is. Charging any day with something recorded on it: an hour
after midnight would charge the next day's expected hours, even a day of leave.
**Revisit if:** the employer requires absences to be recorded by type.
**Cases:**
- Janitor, Friday 22:00 to Saturday 01:00: Saturday adds +1 (a weekend has no expected hours).
- Janitor, Thursday 22:00 to Friday 01:00, Friday on leave: Friday adds +1, not 1 − 6.
- Janitor, Sunday 22:00 to Monday 01:00, then Monday 11:00–17:00: Monday adds 1 + 6 − 6 = +1.
- An empty weekday: adds nothing.
- A flex day: −6.

## A month starts on a set day (2026-11-14)

**Built by:** Profiles, with the ceiling.

**Decision:** the app's month runs from a set day to the day before it in the next month, to match how the school
counts. The month start is a global setting, a day from 1 to 28, default the 1st, and changes from a date like the
other settings ("Settings change from a date"). The ceiling, the report and pruning all count this month. A change
makes the month it falls in run from the old start to the day before the new one, once shorter or longer; its ceiling
follows its weekdays as any month's does.
**Why:** the report and the ceiling have to count the same month, or a report's wheel would match neither of its
ceilings; one global setting keeps them together. Days up to 28 exist in every month.
**Rejected:** a month start for the report alone: its wheel would cover parts of two ceilings. The calendar month
only: the school may count from another day.
**Revisit if:** the school counts in weeks or terms rather than months.
**Cases:**
- Month start 16: the month of 16 March to 15 April has its ceiling from the weekdays in that span.
- Month start changed from 1 to 16, from 16 March: 1–15 March is one short month, then 16 March–15 April.
- Default month start: a month is the calendar month.
