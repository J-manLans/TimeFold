# Time

How hours count: on which day, against expected hours, which days owe them, and what a month is. Each decision follows
the template in `README.md`, and is cited by its title.

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

**Built by:** Breaks and flex days, for flex days.

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

## A flex day can be marked ahead, and the screen counts it at once (2026-11-17)

**Built by:** Breaks and flex days.

**Decision:** a flex day ("A day owes its expected hours only when work started on it") is marked in the calendar under
"Flexledig" in the menu's **Tid** tab ("The menu has tabs, with every value locked behind "Ändra""), always open there.
It shows one month, the weeks starting on Monday, with ‹ and › to the months either side; the days are outlined squares
packed close with a small gap, and a marked day is filled with the base colour of the profile with the balance ("Each
profile carries its colours"). One click on a weekday, today or ahead, marks it, and a click on a marked day unmarks it,
giving its hours back; the balance follows at once, with no range and no confirm. Weekends are greyed out and cannot be
clicked, since they owe no hours, and so is a day janitor work started on, padlock or not: it is charged its hours
already, so marking it would change nothing, and a flex day marked ahead and then worked keeps its fill, greyed out.
Today stays open until work starts on it. Days gone by are greyed out and locked too, a past flex day keeping its fill;
a small padlock beside the month name unlocks them, to mark a day off that was forgotten or unmark one, and asks no
reason. It locks again when the owner leaves the tab or closes the menu, and stays open while paging months. To the
calendar's right, every marked day from today on is listed, a line per month: the short month name, then the days as
numbers in the text colour, each jumping the calendar to its month; a month's days wrap under its first day, and a year
gets its own bold line where the list crosses into it. Each line is a day square's height with the days' gap, so it sits
level with a week; in the narrow window the list sits under the calendar. The calendar is the one place flex days are
seen: "Visa alla" lists entries only. The balance on the main screen counts every marked day at once, ahead ones
included, so the flex bar shows the balance as planned: with a day marked ahead and too little balance to cover it, the
bar goes minus, and the minus is the time still to work before that day. If the day comes and the balance is still
short, nothing special happens: the balance carries the minus as any other. A day costs the expected hours in force on
its own date ("Settings change from a date"), so a later change to them changes what a marked day ahead costs. Work
recorded on a flex day adds to it as usual, so a flex day that is worked counts as any workday, and needs no unmarking.
The report counts only days up to its own end: the month's last day, or today for the current month; a flex day ahead is
not in it until the month it falls in ("The report lists the days the balance moved"). Both are one count with two end
dates; the screen's simply runs to the last marked day.

**Why:** the owner plans days off weeks or months ahead; with the hours taken at once, the flex bar always shows the
planned truth, and the minus says how much is left to work for it with no other figure. In the owner's Excel a day off
is a typed zero day on the day itself; marking ahead replaces both the zero day and the sum in the head. Counting the
report only to its end keeps each report true to what happened in its month. A click with the flex bar beside it makes
the change and its result one glance, and a second click is the undo. Five clicks are a week, and skip the weekend by
themselves. A worked day is locked because the count already charges it, so a click there would show nothing happening.
Locking the past keeps a stray click from changing history, and the padlock makes changing it a choice, which is
intention enough. The list finds a day months ahead without paging.

**Rejected:** a range of days: a second way to pick, which would charge the weekend. An "OK" confirming the picks, with
picked days in a neon border: a step with nothing to protect, since the bar shows a mistake at once. Days ahead as
"Flexledig" rows at the top of "Visa alla": flex days in two places, and "Visa alla" holds entries. A forgotten day off
fixed among the corrections: the same split. Past days always open: a stray click would change history. A reason for a
day marked through the padlock. The listed days in the neon, or the years in the base colour: the neon means what is
happening now, and the base marks a flex day. A third bar on the main screen for the hours still needed before a day
off: the flex bar's minus already says it, and the main screen stays as it is. Taking the hours only on the day: the bar
would show a balance that is already spent. The report taking the screen's balance: a month's report would carry days
off not yet taken, maybe more than a year ahead. A line in the report naming days off ahead: the boss reads what
happened, not plans. Adding planned hours back for the report: one count with two end dates gives the same figures with
nothing to keep in step.

**Revisit if:** the boss asks to see days off ahead, or planned days pile up so far ahead that the bar stops being read
as today's balance.

**Cases:**

- Balance +4:37, a flex day on 11 December marked on 17 November: the bar shows −1:23 at once.
- The same, nothing more worked before 11 December beyond expected hours: the balance stays −1:23 after it.
- The same day clicked again in the calendar: the bar is back at +4:37, and the day is gone from the list.
- Saturday in the calendar: greyed out; a click does nothing. Saturday 21 November marked by any other way: refused, so
  a weekend is never a flex day.
- Today with nothing worked: open; a click marks it and the bar drops 6 h. Today once a job has started: greyed out.
- Tuesday, worked 6 h, the padlock open: greyed out; a click does nothing.
- Yesterday, a weekday: greyed out; a click does nothing. Padlock opened, a click marks it and the bar drops 6 h; the
  Profiler tab and back: locked again.
- Days marked on 7 and 8 December 2026 and 19 March 2027, seen in November 2026: the list reads "dec 7 8", then "2027",
  then "mar 19"; clicking 19 shows March 2027.
- Expected hours changed from 6 to 5 from 1 December, the 11 December day already marked: it costs 5 h.
- November's report, with the 11 December day marked: November's figures and lines do not include it; December's report
  lists it.
- A flex day on 25 November, November's report exported on 20 November: the day is not in it; exported on 1 December: it
  is.
- Three hours worked on a flex day: the day adds 3 − 6 = −3.

## The app's month is the calendar month (2026-11-16)

**Built by:** Profiles, with the ceiling.

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
