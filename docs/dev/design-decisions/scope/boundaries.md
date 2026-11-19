# Scope: boundaries

Who the app is for, where it runs, what it does, and what it keeps. The first start is in `first-start.md`. Each
decision follows the template in `../README.md`, and is cited by its title.

## One user, offline, on the owner's machines (2026-11-14)

**Decision:** the app has one user, the owner. It needs no network connection, has no account or login, and keeps its
data only on the owner's own machines: a desktop app on the work computer (Windows; the owner may install programs) and
the owner's computer at home (Linux).

**Why:** it is a personal tool; the only things that leave a machine are the report the owner chooses to send and the
handover file the owner carries.

**Rejected:** a server or cloud sync: nothing needs it, and it adds a connection, an account and a place the data can
leak. A phone app: the owner clicks at a computer, as with the Excel file today.

**Revisit if:** the owner needs to record away from both computers.

## Handover between machines (2026-11-14)

**Built by:** Handover.

**Decision:** the record moves between the two machines by handover. Export writes one file holding everything:
profiles, settings, entries and balances; only the theme stays behind, as each machine's own; the profiles' colours
travel with the profiles. Import reads such a file and replaces everything on that machine. Every import asks first,
showing when the file was made and when this machine's data last changed, and the owner confirms or cancels. The owner
carries the file (for example by email to themselves) and is responsible for importing before clicking on the other
machine. Export and import are greyed out while any job runs, so a handover never carries or replaces a running entry.

**Why:** the owner works at school and sometimes at home, and uses one machine at a time. A full replace is simple and
cannot double hours; showing both dates makes a wrong or stale file obvious before it overwrites anything.

**Rejected:** merging two copies: the hardest part of the design, to cover a case (clicking on both machines without a
handover) the owner takes responsibility for avoiding. Warning only when the file is older than the local data: asking
every time is simpler and always checked.

**Revisit if:** the owner often ends up with new entries on both machines for the same day.

## The app is in Swedish (2026-11-15)

**Built by:** each part, for its own words.

**Decision:** the app's interface and the report are in Swedish. The app is called TimeFold, in English, as its
repository is.

**Why:** the owner works at a Swedish-language school in Finland, and the boss reads the report. The name is the
owner's: the over lap folds over the start of the ceiling wheel, and the flex bar folds hours either side of zero.

**Rejected:** English: neither the owner nor the boss needs it. A language setting: one user, one language. A Swedish
name ("Varv", "Flexa", "Stämpla"): the owner likes TimeFold, and an English translation can follow if the app spreads.

**Revisit if:** the report goes to someone who does not read Swedish.

## Old history is pruned on request (2026-11-14)

**Built by:** Profiles, once the ceiling's carry exists, since a prune freezes both the balance and the ceiling hours.
Its cases are tested with set dates.

**Decision:** the record keeps a rolling window of three years. When the oldest whole month is more than three years
old, a quiet line at the bottom of the main screen offers to prune ("Du har över tre års historik. Vill du rensa den
äldsta?"), saying how many months it would remove. In a narrow window the line starts right of the menu button in the
corner, its words wrapping over the left and its two buttons stacked on the right. Nothing is pruned without the owner's
yes; "not now" hides the line until the next month. A prune cuts at the start of a month: the balance and the ceiling
hours carried into that month are frozen as opening figures dated the month's first day ("The app's month is the
calendar month"), as at a first install ("A first install starts fresh or imports"), and every entry before it is
deleted. A copy of the record is saved first.

**Why:** the owner does not want the record to grow forever, and the opening figures already carry a balance over a cut,
so pruning reuses them. Cutting at a month's start keeps every remaining month whole, so its report can still be made,
and leaves only the excess carried from the month before as a ceiling figure. Asking first, since a prune cannot be
undone except from the copy.

**Rejected:** keeping every entry forever: the owner prefers a window. Pruning automatically: it deletes the record
without a word. Cutting mid-month: that month's report and ceiling would be split.

**Revisit if:** the boss or payroll asks for months older than the window.

**Cases:**

- First install 1 January 2027; on 1 February 2030 the line offers to prune January 2027. Yes: the balance at the end of
  31 January 2027 and the ceiling hours carried into February become opening figures dated 1 February 2027, and
  January's entries are deleted.
- "Not now" on 3 February 2030: the line returns on 1 March 2030, offering two months.

## A plain window app (2026-11-14)

**Decision:** the app is an ordinary window: the owner opens it, clicks, and minimises or closes it, and closing it
quits it. It has no tray icon, no always-on widget and no autostart. Timing does not depend on the app running: an entry
stores the moments of its start and stop, so a start clicked in the morning is counted correctly however long the app
stays closed ("A running entry from an earlier day asks").

**Why:** the owner clicks at a computer at the start and end of work, and opening the app for that is one click. Nothing
in the counting needs a process in the background.

**Rejected:** an always-on widget: nothing needs it on screen all day. Autostart with the window opening minimised: the
owner does not want a window at login. A tray icon now: it adds nothing the app needs; it waits as an idea, with
autostart ("A tray icon, with autostart", in `codebase-ideas.md`).

**Revisit if:** the owner opens the app many times a day just to see what runs.

## What the app does (2026-11-14)

**Built by:** Breaks and flex days, Profiles, Corrections and Reports.

**Decision:** the app starts and stops an entry with one click; records errands, taken off the day's total; lets the
owner write entries by hand and edit clicked ones; keeps past entries, at least the last three years ("Old history is
pruned on request"); and exports a report to send to the boss.

**Why:** this is what the owner asked for; everything else is outside the vision.

**Rejected:** none yet.

**Revisit if:** the owner's work changes what has to be reported.
