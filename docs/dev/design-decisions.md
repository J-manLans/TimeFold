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
**Cases:** only while some are not yet tests: concrete examples, given this, expect that. Each case leaves when its
test is written.
```

When a decision changes, rewrite the entry to say what is true now; a reversal that still matters becomes a
rejected alternative. **Rejected** pays off most: an agent will suggest the elegant alternative that was turned down
for a reason it cannot see, and one line there stops it. **Built by** exists because a present-tense decision
written before its code reads as a description of the code. **Cases** keeps what was agreed in talk until its phase
is built ("Tests come first, from the owner's rules"); a case that checks two decisions goes under the one it mainly
checks and names the other by title.

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

### Code

#### Tests come first, from the owner's rules (2026-11-14)

**Built by:** Phase 1, from its first code.

**Decision:** before a piece of code is written, the owner says what must hold and what must never happen. Owner and
agent talk it through as a conversation: the agent names what it thinks is missing, and together they settle what
fits. The agreed cases are written as tests and seen to fail before the code is written. Cases agreed before their
phase wait in the **Cases** line of the decision they mainly check. Tests are named for the rule they check, and a test
cites its decision by title only when its name cannot carry the reason. What cannot be tested automatically, such as
how something looks, is checked by hand under the phase's **Done when**.
**Why:** the rules come from the owner's working day, and a red test proves the rule is understood before the code
exists. Keeping cases under their decision means they change with it, and nothing agreed in talk is lost before its
phase.
**Rejected:** tests written after the code: they tend to check what the code does, not what the owner meant. A
separate file of cases grouped by module: the modules do not exist yet, and the cases would drift from their rules.
A sign-off checklist for cases: the workflow must not become a bottleneck. Every test citing its decision: a
well-named test already says its rule.
**Revisit if:** writing the cases first slows the work more than it saves.

### Recording

#### One start/stop button and a profile list (2026-11-14)

**Built by:** Phase 1 for the button; Phase 3 for the profile list.

**Decision:** the main control is one button: "Start work", which becomes "Stop work" while an entry runs. Beside it
is the list of profiles. Picking a profile changes only which profile is on screen; a running entry goes on. Pressing
start on the profile on screen ends the running entry, if any, at that moment and starts one on that profile, so at
most one entry runs at a time. While another profile's entry runs, the button says what it will do (such as "Start B
(stops A)"), and the running profile is shown. A forgotten switch back is corrected by hand. The totals and bars
update when an entry stops; nothing ticks while it runs, and the update at stop is the visual effect.
**Why:** one running entry is the simplest record, and it is how common time trackers work. A break needs no control
of its own ("Time away is a gap or an added break").
**Rejected:** four buttons per profile (start day, end day, start break, end break), with a profile left on a break
while another runs: each profile needed a paused day, and a date check to close it. A running clock: the owner
prefers the whole update at stop.
**Revisit if:** the owner often needs two profiles running at once.
**Cases:**
- A running, B picked: A still runs, and nothing is recorded.
- A running, start pressed on B at 13:00: A ends at 13:00, B starts at 13:00.
- A on screen and running, stop pressed: A ends; nothing runs.
- While an entry runs, the day total and bars do not change; at stop they include it.

#### A running entry from an earlier day asks (2026-11-14)

**Built by:** Phase 1.

**Decision:** nothing stops an entry by itself. During the day, the stop click is the only signal of when work ended.
When the app is opened or clicked on a later date than a still-running entry started, it says so ("Work has been
running since yesterday 21:30") and asks: **Still working**, and the entry goes on, or **I stopped at…**, and the
clock sets its end.
**Why:** late work from home can cross midnight, so a running entry is not always a mistake; but usually it is, and
the owner should hear of it at once, not find it in the report. It is also a reminder to go to bed.
**Rejected:** stopping the entry at midnight: it records an end that is false but looks believable, and the app may
not be running at midnight. Doing nothing until a correction: the mistake surfaces too late.
**Revisit if:** the question comes up for days that were really worked through the night.
**Cases:**
- Entry started yesterday 21:30 and running, app opened today: the question is asked.
- Answer "I stopped at 23:10": the entry ends yesterday at 23:10.
- Answer "Still working": the entry runs on; the question comes again only at the next change of date.
- Entry started today and running: no question.

#### An entry belongs to the day it started (2026-11-14)

**Built by:** Phase 1.

**Decision:** all of an entry's time counts on the day it started, including any part after midnight. The date comes
with every recorded timestamp.
**Why:** the balance is counted per filled-in day ("A day counts only when filled in"). Splitting at midnight would
make the next day filled in with a few hours, and charge its expected hours against them. Only the profiles without
expected hours are likely to run past midnight.
**Rejected:** splitting an entry at midnight between two days.
**Revisit if:** a profile with expected hours is worked across midnight.
**Cases:**
- Tuesday 22:00 to Wednesday 01:00: Tuesday gets 3 h; Wednesday gets nothing.
- The same on a profile with a balance: Wednesday is not filled in, so it does not count 0 or 1 h minus the expected
  hours.

#### Time away is a gap or an added break (2026-11-14)

**Built by:** Phase 1 for the gap; Phase 2 for the added break.

**Decision:** a planned break is a stop and a later start; the gap between them is not work. Time
away that happens during a running entry, unplanned (such as own errands slipped into a work errand), is an
**added break**: a length of time taken off an entry, added afterwards with a quiet "add break" control. An added
break holds only its length, not when it happened. It goes to the last entry started today on the profile on screen,
running or stopped; when there is none, the control is greyed out. It cannot be longer than its entry. Today's
entries are listed under the bars, with today's added breaks as small tags among them; clicking a tag opens the same
length field with the number in it, to change or remove.
**Why:** the owner's errands are often unplanned and noted afterwards, as in the Excel file today. The totals need only
the length. A hasty mistake must be fixed where it is seen, not dug out of an editor.
**Rejected:** start-break and end-break clicks: a stop and a start do the same with no new control, and an unplanned
break cannot be clicked as it happens. Recording when an added break happened: nothing uses it. Adding a break to an
earlier day from this control: that is a correction.
**Revisit if:** the report needs breaks shown by time or kind.
**Cases:**
- Entry 08:00–12:00 with a 45 min added break: 3 h 15 min.
- Profile on screen has no entry started today: "add break" is greyed out.
- A running, B on screen with a stopped entry from today: the break goes to B's entry.
- A 5 h break on a 2 h entry: refused.
- A break changed from 45 to 35 min: the entry's worked time grows by 10 min.

#### Entering a length of time (2026-11-14)

**Built by:** Phase 2.

**Decision:** a length of time, such as an added break, is typed into one field: a plain number is minutes ("45"), and
hours and minutes are written "1:20". While typing, the field shows how it reads the input ("1 h 20 min"). The clock
picker is for times of day only.
**Why:** one short field is the least fuss, and "1:20" is how the owner writes a length in Excel. Showing the reading
catches a hasty mistake before it is saved.
**Rejected:** separate hour and minute fields: more to fill in. The clock picker: it picks a time of day, not a length.
**Revisit if:** typed lengths are often misread.
**Cases:**
- "45": 45 min.
- "1:20": 80 min, shown as "1 h 20 min".
- "5", "05" and "0:05": 5 min.

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
Switching is done as in "One start/stop button and a profile list". A day can mix profiles, and the
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
