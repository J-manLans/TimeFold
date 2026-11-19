# Reports

What leaves the app for the boss. Each decision follows the template in `README.md`, and is cited by its title.

## The report is a PDF (2026-11-14)

**Built by:** Reports.

**Decision:** the report the owner sends to the boss is a PDF file.

**Why:** it is sent as it is and looks the same wherever it is opened, and it can carry the flex bar and ceiling wheel
figures that make a month readable at a glance.

**Rejected:** a spreadsheet (CSV or Excel): no figures, and easy to change by mistake. Text pasted into an email: no
figures, and its layout depends on the mail program.

**Revisit if:** the boss or payroll needs the hours in a form they can calculate with.

## A report covers one month (2026-11-14)

**Built by:** Reports.

**Decision:** a report covers one month ("The app's month is the calendar month"); any month can be exported, the
current one partway through included. It shows: the month, the year and the owner's name; janitor work as the flex bar,
with the balance brought in, the month's change and the balance carried out; the other work as the ceiling wheel, with
the ceiling, the hours used, and the hours carried in and out; and each profile's hours for the month, grouped by pay
category where categories are set. An option at export, off by default, adds each day's hours per profile, without clock
times. The pay estimate and the marks of how entries were made stay out ("A pay estimate per profile"; "Entries remember
how they were made"), except an edit's reason on a day the report lists ("The report lists the days the balance moved").

**Why:** the boss needs to see that the janitor balance is not far over or under, and the exact hours of the other
profiles, whose pay may differ. Carried amounts make each report start where the last ended, so the months read as one
history. Days are there if the boss ever asks, without crowding the usual report.

**Rejected:** any date range: it would split the ceiling's month. Days always included: the boss has not asked for them.
Clock times per day: more than anyone needs.

**Revisit if:** the boss or payroll asks for clock times, or for a period other than the month.

**Cases:**

- Balance +4:00 at the month's start and +6:30 at its end: the report shows +4:00 brought in, +2:30 for the month, +6:30
  carried out.
- 3 h over the ceiling carried in, 2 h carried out: the wheel's numbers show both.
- Exported with days ticked: a page lists each day with its hours per profile.

## The report lists the days the balance moved (2026-11-17)

**Built by:** Reports.

**Decision:** under the flex bar, the report lists the month's days that moved the janitor balance, one line each, in
date order: the date and the day's net change, in whole minutes ("Time is counted to the second and shown to the
minute"). A day whose net change, rounded to the minute, is under 5 minutes either way is left out, however its start
and end fell; its change still counts, and the left-out days' sum closes the list as one line, "Små avvikelser under
månaden: +0:23", shown unless it rounds to zero. A flex day is always listed, as "Flexledig", its date and its hours,
such as −6h. A listed day with an entry edited or written by hand carries each such entry's reason as a short tag
("Every edit carries a reason"). The lines and the closing line add up to the month's change. The list counts only the
days up to the report's end, so a flex day ahead is listed only in its own month's report ("A flex day can be marked
ahead, and the screen counts it at once"). The main screen shows none of this.

**Why:** the boss sees where the balance moved without reading every day; a start and end both late by the same amount
moved nothing, and the report shows no clock times anyway. A day's net change is one rule with no special cases. The
closing line keeps the list honest: the hidden minutes are counted where they belong and named once, so the lines always
add up to the month's figure.

**Rejected:** a tolerance on how the day was shaped, such as a late start with a late end: a second threshold, for
something the report does not show. Carrying small changes onto a later day, or onto the day their sum passes 15
minutes: the report would show minutes on a day they did not happen, against the honesty "Entries remember how they were
made" keeps. Hiding small days with no closing line: the list would not add up to the month. The tolerance as a setting:
nothing to tune yet. Every day listed: the days page does that, when asked for ("A report covers one month").

**Revisit if:** the boss asks about days the list leaves out, or 5 minutes proves too much or too little.

**Cases:**

- A day +0:47: listed, "+0:47".
- A day +0:04 and another −0:02, nothing else small: neither listed; the closing line reads "+0:02".
- A day started 1 h late and ended 1 h late: net 0, not listed.
- A day exactly +0:05: listed.
- Small days summing to +0:00 after rounding: no closing line.
- A flex day on 11 December: listed in December's report as "Flexledig", 11 December, −6h.
- A listed day with one entry edited, reason "Glömde stämpla ut": the line carries "Glömde stämpla ut".
