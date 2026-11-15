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

**Decision:** a report covers one month ("A month starts on a set day"); any month can be exported, the current one
partway through included. It shows: the month, the year and the owner's name; janitor work as the flex bar, with the
balance brought in, the month's change and the balance carried out; the other work as the ceiling wheel, with the
ceiling, the hours used, and the hours carried in and out; and each profile's hours for the month, grouped by pay
category where categories are set. An option at export, off by default, adds each day's hours per profile, without clock
times. The pay estimate and the marks of how entries were made stay out ("A pay estimate per profile"; "Entries remember
how they were made").

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
