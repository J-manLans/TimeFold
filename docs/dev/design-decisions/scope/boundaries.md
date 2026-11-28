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

## Handover between machines (2026-11-28)

**Built by:** Handover.

**Decision:** the record moves between the two machines by handover, a file the owner carries (for example by email to
themselves). "Exportera" opens the system's save dialog, suggesting `TimeFold 2026-11-28.json` in the folder last used.
The file holds everything in the record (profiles, settings, entries, flex days and opening figures) and the time it was
made; the theme and the machine's own settings stay behind. Once it is saved, the button reads "Exporterad" for about
two seconds, the words fading across and its width held, then "Exportera" again; a cancelled dialog shows nothing.

"Importera" opens the system's open dialog, showing `.json` files. A file that is not a record, or is of a newer version
("The record is one JSON file"), is refused with a plain message in the same popup, and nothing changes. Otherwise a
popup in the popups' frame, centred on the controls side, asks before anything is replaced: "Importen ersätter den här
datorns data med filens, med de val du gör nedan.", then "Filen skapades: tis 24 nov, 20:04", then up to two folded
lists, each shown only with rows in it:

- **What the file adds:** "6 nya poster ▸", every row ticked.
- **What only this machine has:** "Den här datorn har 3 ändringar som saknas i filen ▸", in the warning colour, every
  row unticked. When this list shows, the question is a warning; without it, the question is calm.

The two records are compared by content, not by id, and only from the later of their two opening days: a prune moves the
opening ("Old history is pruned past three years"), so months one side has pruned are not listed, and before that day
the record comes out as the file has it. A row is an entry, a dated setting (pay, full time, the split), a flex day, a
profile's name, or a profile made only here. Two rows that cannot both stand in a record (entries that overlap, two
values of one setting from one day, two names of one profile) are a pair: ticking one unticks the other, so an entry
edited on both machines is kept in whichever version the owner picks. Ticking an entry of a profile made only here ticks
that profile too, and unticking the profile unticks its entries. The profiles' colours, the reason list, the archived
mark and the tax follow the file, with no rows. Once a tick differs from its default, the folded line says so ("6 nya
poster, 5 valda").

"Ersätt" saves the current record into `copies/` and then makes the record the file, minus the file's rows unticked,
plus this machine's rows ticked; the rows kept from this machine get new ids. "Avbryt" changes nothing. An import has no
undo. Export and import are greyed out while any job runs, so a handover never carries or replaces a running entry.

**Why:** the owner works at school and sometimes at home, and uses one machine at a time. Left at its defaults, the
import is a full replace, simple and unable to double hours. The comparison shows the one thing that matters before
replacing, whether this machine holds something the file lacks, and names it; the ticks let the owner keep it, which
covers forgetting to export without an automatic merge. Comparing content knows what a date only hints at, and needs no
time of the last change kept in the record. The copy covers a bad pick, since the copies made at start would otherwise
lose the day.

**Rejected:** merging two copies automatically: the hardest part of the design, guessing what the ticks let the owner
choose ("Merging two machines' records at import", in `codebase-ideas.md`). A warning from dates, the file's time
against this machine's last change: it only hints, needs a time of the last change patched at every import, and cannot
name what would be lost. One tick for all of this machine's entries: a deleted entry coming back from the file could not
be dropped. Keeping this machine's profile and setting changes as a block, apart from rows: a partial import with a rule
for every clash. Warning only when the file is older than the local data: asking every time is simpler and always
checked.

**Revisit if:** the owner often ends up picking rows on both sides for the same day.

**Cases:**

- Work exports at 16:00; home, unchanged since its last import, imports it: the calm question, "6 nya poster", no
  warning list.
- Home has two entries from Saturday that the work file lacks: the warning list holds both, unticked; ticking them and
  replacing gives the work record plus Saturday's two, with new ids.
- An entry edited on both machines: a pair, the file's version ticked; ticking this machine's version unticks the
  file's.
- An entry deleted here after the export comes back from the file: it is a row in "nya poster", and unticking it keeps
  it deleted.
- Work pruned its oldest month and exported; home has not pruned: the month is not listed, and home comes out pruned.
- A profile made only here, one of its entries ticked: the profile is ticked and comes along.
- Utveckling renamed here to "Utv": a pair of the two names, the file's ticked.
- A file that is not JSON, or not a record: refused with a plain message; the record is unchanged.
- "Ersätt": `copies/` holds the record as it was just before.

## The app is in Swedish (2026-11-15)

**Built by:** each part, for its own words.

**Decision:** the app's interface and the report are in Swedish. The app is called TimeFold, in English, as its
repository is.

**Why:** the owner works at a Swedish-language school in Finland, and the boss reads the report. The name is the
owner's: the over lap folds over the start of the ceiling wheel, and the flex bar folds hours either side of zero.

**Rejected:** English: neither the owner nor the boss needs it. A language setting: one user, one language. A Swedish
name ("Varv", "Flexa", "Stämpla"): the owner likes TimeFold, and an English translation can follow if the app spreads.

**Revisit if:** the report goes to someone who does not read Swedish.

## Old history is pruned past three years (2026-11-28)

**Built by:** Handover, for the automatic prune.

**Decision:** the record keeps a rolling window of three years, pruned automatically by default. "Rensa historik äldre
än tre år automatiskt", a checkbox in the menu's **Tid** tab ("The menu has tabs, with every value locked behind
"Ändra""), is on unless the owner turns it off; it is kept in the record, so it travels with the handover and both
machines prune alike. A prune cuts at the start of a month: the balance and the ceiling's trend up to that month, where
it reaches back past the cut ("The ceiling's trend"), are frozen as opening figures dated the month's first day ("The
app's month is the calendar month"), as at a first install ("A first install starts fresh or imports"), and every entry
that ended before it is deleted. The balance is frozen to the second, so no figure moves by a rounding; an entry across
the cut is kept whole, its part before the cut inside the opening, since a day before the record's first day counts
nothing; the flex days before the cut go with it. A month may go when it ended more than three years before today and
more than three years before the newest entry's day.

With the setting on, the day's first start, after the day's copy ("The record is one JSON file"), cuts the oldest such
month, silently and at most one month per start: in normal use one month passes the line each month, and a backlog
(after a long break, or the setting turned on late) leaves a month a day. With it off, when such a month exists, a quiet
line at the bottom of the main screen offers to prune ("Du har över tre års historik. Rensa de äldsta 3 månaderna?", or
"Rensa den äldsta månaden?" for one), with "Rensa" and "Inte nu". In a narrow window the line starts right of the menu
button in the corner, its words wrapping over the left and its two buttons stacked on the right. "Rensa" asks once more,
as "Ta bort" does ("The look: a fresh display face, mono text and soft buttons"), and cuts every month offered; "Inte
nu" hides the line until the next month, and is kept with the machine, beside the theme, as the day the line comes back.

**Why:** the owner does not want the record to grow forever, and sees no reason to keep older days: the boss and payroll
work from the monthly reports already sent. Confirming each month is a chore for an answer that is always yes; the
setting is the owner's standing yes. The opening figures already carry a balance over a cut, so pruning reuses them.
Cutting at a month's start keeps every remaining month whole, so its report can still be made, and leaves the trend as
one figure where it began before the cut. The two guards are for a wrong clock, which looks just like a long break: the
newest entry keeps a clock jumped years ahead from cutting anything at start, and the one month per start keeps a click
made under it from cutting more than a month a day, so the daily copies still hold the record when it is noticed.

**Rejected:** keeping every entry forever: the owner prefers a window. Asking every month as the only way: a chore. A
yearly offer cutting a whole year: still a click for an answer that is always yes. Cutting every overdue month at once:
one start under a wrong clock would wipe the record, and within 31 days every copy with it. Cutting mid-month: that
month's report and ceiling would be split.

**Revisit if:** the boss or payroll asks for months older than the window.

**Cases:**

- One month of data, the clock jumped six years ahead: nothing is cut.
- The app opened after six years away: nothing is cut at that start; after the day's work, each later day's first start
  cuts one month, the oldest first.
- Setting on, the oldest month just passed three years: the next day's first start cuts it, after the day's copy.
- Setting off: the offer line, unchanged.

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

**Built by:** Reports.

**Decision:** the app starts and stops an entry with one click; records errands, taken off the day's total; lets the
owner write entries by hand and edit clicked ones; keeps past entries, at least the last three years ("Old history is
pruned past three years"); and exports a report to send to the boss.

**Why:** this is what the owner asked for; everything else is outside the vision.

**Rejected:** none yet.

**Revisit if:** the owner's work changes what has to be reported.
