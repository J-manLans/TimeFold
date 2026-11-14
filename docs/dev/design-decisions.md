# Design decisions

The template, the principles most decisions follow, and every decision, grouped by area. Present tense: what is true
now. Open questions stay out (`open-questions.md`); so does state (`roadmap.md`). Cite a decision by its title.

## Template

```
## Title (date last settled)

**Built by:** only while some of it is not built: the phase that builds it, or "nothing on the roadmap yet" and
what it waits on. The line goes when it is built. An entry without it is taken as built.

**Decision:** what is true.
**Why:** the reason.
**Rejected:** alternatives worth not suggesting again, each with its reason.
**Revisit if:** the condition that would reopen it.
```

When a decision changes, rewrite the entry to say what is true now; a reversal that still matters becomes a
rejected alternative. **Rejected** pays off most: an agent will suggest the elegant alternative that was turned down
for a reason it cannot see, and one line there stops it. **Built by** exists because a present-tense decision
written before its code reads as a description of the code.

## Principles

- **One click to start or stop.** Anything that slows the click down needs a strong reason.
- **The record is the owner's and stays on their own machines.**
- **Work time is time present minus errands.** Every total in the app and in reports is counted this way.

## Decisions

### Scope

#### One user, offline, on the owner's machines (2026-11-14)

**Built by:** Phase 1, with the storage chosen in Phase 0.

**Decision:** the app has one user, the owner. It needs no network connection, has no account or login, and keeps
its data only on the owner's own machines: a desktop app on the work computer (Windows; the owner may install
programs) and the owner's computer at home (Linux).
**Why:** it is a personal tool; the only things that leave a machine are the report the owner chooses to send and the
handover file the owner carries.
**Rejected:** a server or cloud sync: nothing needs it, and it adds a connection, an account and a place the data
can leak. A phone app: the owner clicks at a computer, as with the Excel file today.
**Revisit if:** the owner needs to record away from both computers.

#### Handover between machines (2026-11-14)

**Built by:** nothing on the roadmap yet; it needs the storage chosen in Phase 0.

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

#### What the app does (2026-11-14)

**Built by:** Phases 1–5: clicking in Phase 1, errands in Phase 2, profiles in Phase 3, correcting in Phase 4,
reports in Phase 5.

**Decision:** the app starts and stops an entry with one click; records errands, taken off the day's total; lets the
owner write entries by hand and edit clicked ones; keeps every past entry; and exports a report to send to the boss.
**Why:** this is what the owner asked for; everything else is outside the vision.
**Rejected:** none yet.
**Revisit if:** the owner's work changes what has to be reported.

### Stack

#### Tauri, desktop on Windows and Linux (2026-11-14)

**Built by:** Phase 1.

**Decision:** the app is built with Tauri: a web-style interface on the system's webview, with a Rust backend,
packaged as one small program for Windows and Linux.
**Why:** the app runs on the owner's Windows work computer and Linux home computer, and its interface has animation and
custom controls (the balance bar, the ceiling circle, the clock picker) that a web-style interface makes easy. Tauri
gives a small program that starts fast, and the owner wants to try it. On Linux the webview is WebKitGTK, which can lag
on newer CSS and animation, so animations are tested on Linux early.
**Rejected:** Electron: the same Chromium everywhere, but a program of about 100 MB for a small tool. Python with
Tkinter or Qt: custom animated controls are harder. A local web page in the browser: browser storage can be wiped,
which is risky for a record the boss relies on. A phone app: the owner clicks at a computer.
**Revisit if:** WebKitGTK cannot show the interface acceptably on Linux.

### Reports

#### The report is a PDF (2026-11-14)

**Built by:** Phase 5; what it shows waits on "Report period and content", in `open-questions.md`.

**Decision:** the report the owner sends to the boss is a PDF file.
**Why:** it is sent as it is and looks the same wherever it is opened, and it can carry the balance bar and ceiling
circle figures that make a month readable at a glance.
**Rejected:** a spreadsheet (CSV or Excel): no figures, and easy to change by mistake. Text pasted into an email: no
figures, and its layout depends on the mail program.
**Revisit if:** the boss or payroll needs the hours in a form they can calculate with.

### Time

#### Expected hours: 6 a day, Monday to Friday (2026-11-14)

**Built by:** Phase 1.

**Decision:** the owner's janitor work is expected to be 6 hours a day, Monday to Friday. The janitor balance is each
day's janitor hours minus 6, added up over time.
**Why:** it is the owner's working time as a janitor, and what the Excel file counts against today.
**Rejected:** none yet.
**Revisit if:** the owner's working time changes, or differs over the year.

#### A day counts only when filled in (2026-11-14)

**Built by:** Phase 1 for worked days, Phase 2 for flex days.

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

#### Profiles label the hours (2026-11-14)

**Built by:** Phase 3; entries carry a profile from Phase 1.

**Decision:** every entry belongs to one profile (such as janitor work, the development group, work from home).
Switching profile is one action that ends the current entry and starts the next. A day can mix profiles, and the
owner adds profiles as new kinds of work come up. Profiles are isolated: each counts its own days and hours, and work
in one never changes another. A profile holds: a short name (what is tapped when switching); optional expected
hours, and only a profile with them has a balance; a colour or icon; active or archived (an archived profile leaves
the switch list but keeps its hours in the history and reports); and a pay category, a label only, so reports can
group hours by how they are paid. Reports show hours per profile.
**Why:** the owner's work is paid differently depending on the task and where it is done. Keeping profiles apart
means a Saturday of development group work cannot touch the janitor balance, with no special rule for it.
**Rejected:** the app calculating pay from a rate per profile: salary rules belong to payroll, and would make the app
wrong whenever they change. A yes/no "counts toward the balance" setting per profile, with one shared balance: it
let work in one profile change another's balance. A "reported to" field on each profile: the owner does not need it.
**Revisit if:** the owner needs the app to show money.

#### The other profiles share a ceiling (2026-11-14)

**Built by:** Phase 3; the figures wait on "Working time limits", in `open-questions.md`.

**Decision:** janitor work is the only profile with expected hours, and so the only balance. All other profiles
together share one ceiling: the hours up to full time, such as full time minus the janitor's 6. The ceiling is never
owed: working under it costs nothing. It has an amount and a period, both settings, and the front page shows how
much of it is used beside the balance, warning when it nears the ceiling. It never blocks a click.
**Why:** the owner's other work comes on top of the janitor job, within what full time and the law allow. Showing
what is left of an allowance reads more easily than a total of all hours against full time.
**Rejected:** expected hours for the other profiles (such as 2 a day): every day without that work would put the
owner in minus. A fixed daily ceiling chosen by the app: the period comes with the limit, from the contract or law.
**Revisit if:** another profile gets hours of its own to work, or the limits apply to all hours together in a way
the ceiling does not show.
