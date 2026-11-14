# Time

How hours count: on which day, against expected hours, which days owe them, what a month is, and how the balance
shows. Each decision follows the template in
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

## The balance bar (2026-11-14)

**Built by:** Clocking; its colour settings with the ceiling wheel's, in Profiles.

**Decision:** the janitor balance shows as a horizontal bar from a 0 line, minus to the left and plus to the right, with
the balance as a number. The bar is only its active part, with no track behind it. Minus (hours to work in) is in the
bar's base colour; plus (hours to take out) in its over colour; exactly 0 is a small marker centred on the 0 line, in
the base colour dimmed. The bar's colours work as the ceiling wheel's ("The ceiling wheel"): a base and an over colour,
each with a picker, the dimmed colour worked out from the base and the over colour suggested from it, set per machine.
One switch, "Unify colours", is shown in both the bar's and the wheel's colour settings and stored once, on by default.
While it is on, the two share one set of colours, and a change in either place changes both. Turned on while they
differ, the colours of the place it is turned on from go to both. Turned off, each keeps what it has, and they are set
apart from then on. A large minus gets no warning.
**Why:** one meaning per colour across both figures: the over colour is "more than expected", which a plus balance is;
minus is work still to do, in the calm base colour; dimmed is "nothing either way". With no track, the dimmed marker at
0 stands on its own. Turning unify on, the owner is looking at the colours they want, so those win; one switch stored
once cannot disagree with itself.
**Rejected:** a track behind the bar in the dimmed colour: the 0 marker would vanish into it. Minus in the over colour:
the over colour means hours beyond what is owed, which minus is not. A switch on the bar alone that makes it follow the
wheel: it made the wheel the leader for no reason. A fixed owner, such as the bar, when unify is turned on: turned on
from the wheel's settings, it would replace the colours being looked at. A warning for a large minus: the owner does not
want one.
**Revisit if:** a third figure gets colours of its own, and unify has to say which it joins.
**Cases:**
- Balance 0: the dimmed marker sits centred on the 0 line.
- Balance −3:00: a bar to the left in the base colour.
- Balance +5:00: a bar to the right in the over colour.
- Unify on, the wheel's base changed to blue: the bar's base turns blue too, and both over colours follow the
  suggestion.
- Unify off, then the bar's over colour picked by hand: a later change to the wheel leaves the bar as it is.
- Wheel orange and bar green, unify turned on from the bar's settings: both turn green.
