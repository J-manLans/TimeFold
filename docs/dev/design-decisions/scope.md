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

## What the app does (2026-11-14)

**Built by:** Clocking, Breaks and flex days, Profiles, Corrections and Reports.

**Decision:** the app starts and stops an entry with one click; records errands, taken off the day's total; lets the
owner write entries by hand and edit clicked ones; keeps every past entry; and exports a report to send to the boss.
**Why:** this is what the owner asked for; everything else is outside the vision.
**Rejected:** none yet.
**Revisit if:** the owner's work changes what has to be reported.
