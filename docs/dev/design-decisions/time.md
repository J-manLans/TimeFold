# Time

How hours count: expected hours, and which days count. Each decision follows the template in `README.md`, and is cited
by its title.

## Expected hours: 6 a day, Monday to Friday (2026-11-14)

**Built by:** Clocking.

**Decision:** the owner's janitor work is expected to be 6 hours a day, Monday to Friday. The janitor balance is each
day's janitor hours minus 6, added up over time.
**Why:** it is the owner's working time as a janitor, and what the Excel file counts against today.
**Rejected:** none yet.
**Revisit if:** the owner's working time changes, or differs over the year.

## A day counts only when filled in (2026-11-14)

**Built by:** Clocking for worked days; Breaks and flex days for flex days.

**Decision:** for a profile with a balance, a day counts only if something is recorded for that profile: one of its
entries, or a flex day. A worked day adds the profile's hours minus its expected hours. A flex day, marked with one
action for a day or a range of days, takes off the full expected hours. An empty day counts for nothing: weekends,
public holidays, annual leave and sick days are simply left empty. Hours taken out within a day need nothing special: a
short day lowers the balance by itself.
**Why:** it is how the owner's Excel file works today, proven in daily use, and it needs no calendar of holidays to
keep up to date. The flex day replaces the one thing that is awkward in Excel: typing a zero day for each day off.
**Rejected:** a calendar of expected working days (holidays, leave) that charges the expected hours unless a day is
excused: more to maintain, and wrong whenever the calendar is.
**Revisit if:** the employer requires absences to be recorded by type.
