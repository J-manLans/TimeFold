# Scope

Who the app is for, where it runs, and what it does. Each decision follows the template in `README.md`, and is cited by
its title.

## One user, offline, on the owner's machines (2026-11-14)

**Built by:** Clocking.

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

## A first install starts fresh or imports (2026-11-14)

**Built by:** Clocking for the first start and the opening balance; Handover for importing.

**Decision:** an app with no data asks once how to start, in the menu's frosted panel ("The main screen has a controls
side and a dashboard") grown open over the controls side in a locked stage: no ×, and no click outside or Esc closes it.
The dashboard stays sharp beside it, empty at first. One centred prompt shows at a time, and each step fades out as the
next fades in, over the interface's transition time. First, two buttons: **"Starta nytt"**, and **"Importera"** with
"från fil" under it in quiet text, greyed out until Handover.

**Starta nytt** makes the first profile at once, the one with the balance (janitor work), in its default colours ("Each
profile carries its colours"), and then asks two things, with no fields: a lone blinking caret, the browser's own, under
each prompt.

1. **"Nuvarande flextimmar?"** The balance as it stood at the end of the day before the first day in the app, typed in
   the dashboard's display font: only digits, `:`, `+` and `-` are taken, and Enter moves on only for a whole time (`5`,
   `12:30`, `-3:00`); no sign means plus, as Excel writes it. The number wears where it stands: the base colour at 0 or
   below, the over colour in plus. The dashboard's number and bar follow as it is typed.
2. **"Profilnamn?"** The first profile's name, typed in the colour the balance decided; Enter moves on only when it is
   not empty.

Esc goes back a step, the answer kept. After the name, the panel's text fades away and the panel shrinks into the menu
button, as the menu closes; the screen takes no input until, a short delay later, the profile's letter fades in on the
profile button, the last thing to happen. The balance is kept in the record as an opening figure dated the first day,
apart from the entries: the handover carries it, the reports show it ("brought over: +12:30"), a correction can change
it, and the balance counts from it. The fresh start asks nothing about the ceiling; the hours of the current month's
ceiling already used are an open question ("Whose the opening ceiling hours are"). From then on the app records every
entry with its day. **Importera** reads a handover file instead, as in "Handover between machines", and asks nothing
more: the file brings the profiles with their colours, the settings and the opening figures; the theme starts as
"System". The owner switches from the Excel file on a day not yet worked, with the file closed the evening before; the
Excel history before that stays in the file and is not brought in.

**Why:** the Excel history is not needed by anything the app does, and the boss has not asked for it; parsing the file's
layout would cost much for it. Figures as of the end of the day before mean the app counts every day from its first, so
none is counted twice or missed. Asking at first start keeps a second machine from getting opening figures of its own.
The menu's panel is where the profile's settings will live, so the first start is the first use of it, and its frost
keeps the dashboard in view, where the balance lands as it is typed. One prompt at a time is calm, and leaves the screen
still enough that each answer shows where it goes. The balance comes first because it decides the letter's colour, so
the name and the letter appear once, in their final colour; the letter arriving last, on a still screen, is the moment
the app becomes the owner's. A real input with nothing of a field showing keeps typing, pasting and editing as they
always work. "Från fil" says what the import reads without tying it to a machine; a file that is not a record is named
as such.

**Rejected:** importing the past days from the Excel file: far more work for history no one reads. The opening figures
as settings: settings here change from a date and apply forward, and a setting typed on one machine could be left out of
the other. The opening figures as entries: an opening has an amount, not a start and a stop, and every part that reads
entries (the counting, the recent list, editing, the undo, the report) would have to skip it. Switching in the middle of
a worked day: it happens once, and a fresh day needs nothing built. A page of its own, or a form: the app would appear
only after it, and a form asks everything at once. A slider for the balance: an exact figure from Excel cannot be hit by
dragging. A default name: it invites Enter without a thought. The letter appearing under the frost as the name is typed:
blurred, where it could arrive crisp. The name first: the letter would change colour once the balance came. "Importera"
alone: it reads as importing the Excel file. "Importera från min andra dator": long, and tied to a machine.

**Revisit if:** the boss or payroll asks for days from before the app.

**Cases:**

- First install on Monday, Excel balance +12:30 at Friday's close: the balance starts at +12:30; 7 h worked on Monday
  makes it +13:30.
- `-3:00` typed: the number in the base colour, the bar to the left, the name and then the letter in the base colour.
  `12:30` with no sign: all in the over colour.
- `12:` and Enter: nothing happens; the caret waits. A letter typed into the balance: it does not appear. Enter on an
  empty name: nothing happens.
- Esc on the name: back to the balance, `-3:00` still there; Esc there: back to the two buttons.
- The name entered: the text fades, the panel shrinks into the menu button, nothing can be pressed, and then the letter
  fades in.
- Second machine, first start: "Importera" brings the whole record, opening figures and profile colours included, and
  asks nothing more.

## The app is in Swedish (2026-11-15)

**Built by:** Clocking, for the first screen; each part for its own words.

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
äldsta?"), saying how many months it would remove. Nothing is pruned without the owner's yes; "not now" hides the line
until the next month. A prune cuts at the start of a month: the balance and the ceiling hours carried into that month
are frozen as opening figures dated the month's first day ("The app's month is the calendar month"), as at a first
install ("A first install starts fresh or imports"), and every entry before it is deleted. A copy of the record is saved
first.

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

**Built by:** Clocking.

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

**Built by:** Clocking, Breaks and flex days, Profiles, Corrections and Reports.

**Decision:** the app starts and stops an entry with one click; records errands, taken off the day's total; lets the
owner write entries by hand and edit clicked ones; keeps past entries, at least the last three years ("Old history is
pruned on request"); and exports a report to send to the boss.

**Why:** this is what the owner asked for; everything else is outside the vision.

**Rejected:** none yet.

**Revisit if:** the owner's work changes what has to be reported.
