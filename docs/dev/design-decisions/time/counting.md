# Time: counting

How hours count: on which day, against expected hours, which days owe them, and what a month is. Each decision follows
the template in `../README.md`, and is cited by its title.

## Expected hours: 6 a day, Monday to Friday (2026-11-14)

**Decision:** the owner's janitor work is expected to be 6 hours a day, Monday to Friday. The janitor balance is each
day's janitor hours minus 6, added up over time. The 6 is a setting, changed as in "Settings change from a date".

**Why:** it is the owner's working time as a janitor, and what the Excel file counts against today.

**Rejected:** none yet.

**Revisit if:** the owner's working time changes, or differs over the year.

## Time counts on the day it was worked (2026-11-14)

**Decision:** an entry is stored as one stretch, from its start to its stop, but its time is counted on the calendar day
it was worked: an entry across midnight is split there when counting. This holds for every profile. A profile without a
balance adds each day's hours to the shared ceiling over its period; a profile with a balance adds them as in "A day
owes its expected hours only when work started on it".

**Why:** the report and any working time limits go by calendar days, and an hour after midnight belongs to the next day,
and to the next month at a month's end. Storing one entry keeps corrections simple, and an added break still lands on
its day ("Time away is a gap or an added break").

**Rejected:** counting all of an entry's time on the day it started: simpler, but the record would not match the
calendar, and a period's edge would take hours from the wrong side.

**Revisit if:** the employer counts late work on the day it began.

**Cases:**

- Tuesday 22:00 to Wednesday 01:00: Tuesday 2 h, Wednesday 1 h.
- An entry of a profile without a balance, 31 March 23:00 to 1 April 01:00: 1 h in March's ceiling, 1 h in April's.

## Time is counted to the second and shown to the minute (2026-11-16)

**Decision:** a click records the moment to the second, and the counting works in seconds; every figure the owner sees
is rounded to the nearest minute only when shown, so 3:31:30 shows as 3:32. A hand count from the times on screen can
differ from the app by a minute now and then.

**Why:** with clicks, the seconds are what happened; dropping them would invent a precision the record does not have.
Rounding only for display keeps rounding from adding up over thousands of entries. The owner has rounded to the nearest
five minutes by hand, so a minute's difference is well within what counts as the same.

**Rejected:** clicks recorded to the whole minute, so what is shown is exactly what is counted: each entry would lose up
to a minute's truth for a match the owner does not need.

**Revisit if:** a hand count's minute differences start to matter, say to the boss.

**Cases:**

- Clicked 07:58:40 to 11:30:10: counted 3:31:30, shown 3:32.
- Four entries of 1:59:40 each: counted 7:58:40, shown 7:59, not 8:00.

## A day owes its expected hours only when work started on it (2026-11-14)

**Decision:** for a profile with a balance, each day adds the hours worked on it. A day is also charged its expected
hours only if one of the profile's entries started on it, or it is a flex day. A flex day, a weekday marked in the
calendar ("A flex day can be marked ahead, and the screen counts it at once"), takes off the full expected hours. Any
other day owes nothing: weekends, public holidays, annual leave and sick days are simply left empty, and the app never
needs to know why. Hours that run past midnight into such a day are added to it, and charge nothing. Hours taken out
within a day need nothing special: a short day lowers the balance by itself.

**Why:** it is how the owner's Excel file works today, proven in daily use, and it needs no calendar of holidays to keep
up to date. The flex day replaces the one thing that is awkward in Excel: typing a zero day for each day off. Counting
only days work started on keeps a late night from charging a day of leave.

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
- A flex day still marked, 6 h worked on it: the day adds 6 − 6 = 0, as any workday.

## The app's month is the calendar month (2026-11-16)

**Decision:** the app counts by the calendar month, the 1st to the last day, as the school counts the owner's hours
(their payslip names the period 1st to last of the month, and a month's salary is paid on its 15th). The ceiling, the
report, the pay estimate and pruning all count this month. It is not a setting and is not asked for.

**Why:** the report and the ceiling have to count the same month, or a report's wheel would match neither of its
ceilings, and the school's month is the calendar one. A setting for a month start, changing from a date, cost a menu
control, a history and a short month at each change, for a value the owner would not change while at this school.

**Rejected:** a month start from 1 to 28, set in the menu and changing from a date: decided first, then dropped when the
school's month proved to be the calendar month. A month start asked once at onboarding: nothing to ask. A month start
for the report alone: its wheel would cover parts of two ceilings.

**Revisit if:** the owner works where hours are counted from another day, or in weeks or terms.

**Cases:**

- 16 November: the month is 1–30 November.
- 29 February 2028: the month is 1–29 February.
