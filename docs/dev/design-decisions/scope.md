# Scope

Who the app is for, where it runs, and what it does. Each decision follows the template in `README.md`, and is cited
by its title.

## One user, offline, on the owner's machines (2026-11-14)

**Built by:** Clocking, with the storage chosen in Phase 0.

**Decision:** the app has one user, the owner. It needs no network connection, has no account or login, and keeps
its data only on the owner's own machines: a desktop app on the work computer (Windows; the owner may install
programs) and the owner's computer at home (Linux).
**Why:** it is a personal tool; the only things that leave a machine are the report the owner chooses to send and the
handover file the owner carries.
**Rejected:** a server or cloud sync: nothing needs it, and it adds a connection, an account and a place the data
can leak. A phone app: the owner clicks at a computer, as with the Excel file today.
**Revisit if:** the owner needs to record away from both computers.

## Handover between machines (2026-11-14)

**Built by:** Handover; it needs the storage chosen in Phase 0.

**Decision:** the record moves between the two machines by handover. Export writes one file holding everything:
profiles, settings, entries and balances. Import reads such a file and replaces everything on that machine. Every
import asks first, showing when the file was made and when this machine's data last changed, and the owner confirms
or cancels. The owner carries the file (for example by email to themselves) and is responsible for importing before
clicking on the other machine.
**Why:** the owner works at school and sometimes at home, and uses one machine at a time. A full replace is simple and
cannot double hours; showing both dates makes a wrong or stale file obvious before it overwrites anything.
**Rejected:** merging two copies: the hardest part of the design, to cover a case (clicking on both machines without
a handover) the owner takes responsibility for avoiding. Warning only when the file is older than the local data:
asking every time is simpler and always checked.
**Revisit if:** the owner often ends up with new entries on both machines for the same day.

## A first install starts fresh or imports (2026-11-14)

**Built by:** Clocking for the first start and the opening balance; Profiles for the opening ceiling hours; Handover
for importing.

**Decision:** an app with no data asks once how to start. **Start fresh** asks for two opening figures: the janitor
balance and the hours of the current month's ceiling already used (any carried from the month before included), both
as they stood at the end of the day before the first day in the app. Each is kept as an entry dated that first day,
which the handover carries, the reports show ("brought over: +12:30") and a correction can change like any entry.
From then on the app records every entry with its day. **Import from my other machine** reads a handover file
instead, as in "Handover between machines". The owner switches from the Excel file on a day not yet worked, with the
file closed the evening before; the Excel history before that stays in the file and is not brought in.
**Why:** the Excel history is not needed by anything the app does, and the boss has not asked for it; parsing the
file's layout would cost much for it. Figures as of the end of the day before mean the app counts every day from its
first, so none is counted twice or missed. Asking at first start keeps a second machine from getting opening figures
of its own.
**Rejected:** importing the past days from the Excel file: far more work for history no one reads. The opening
figures as settings: settings here change from a date and apply forward, and a setting typed on one machine could be
left out of the other. Switching in the middle of a worked day: it happens once, and a fresh day needs nothing built.
**Revisit if:** the boss or payroll asks for days from before the app.
**Cases:**
- First install on Monday, Excel balance +12:30 and 18 h of the ceiling used at Friday's close: the balance starts at
  +12:30 and the ceiling wheel at 18 h; Monday's work adds to both.
- Second machine, first start: "Import from my other machine" brings the whole record, opening figures included.

## What the app does (2026-11-14)

**Built by:** Clocking, Breaks and flex days, Profiles, Corrections and Reports.

**Decision:** the app starts and stops an entry with one click; records errands, taken off the day's total; lets the
owner write entries by hand and edit clicked ones; keeps every past entry; and exports a report to send to the boss.
**Why:** this is what the owner asked for; everything else is outside the vision.
**Rejected:** none yet.
**Revisit if:** the owner's work changes what has to be reported.
