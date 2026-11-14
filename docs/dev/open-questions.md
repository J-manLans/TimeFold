# Open questions

What is not decided, grouped under the phase that needs the answer, so a phase's **Settle first** can point here.
Each entry: what is known, the options, the date raised, and **See:** the decisions it touches. An answered question
leaves; its answer goes to `design-decisions.md`. A question half answered stays with what is left of it.

## Phase 0

### Interface language (2026-11-14)

What the Tauri interface is written in: plain TypeScript, or a small framework such as Svelte or React. Settled with
the look and feel.
**See:** Tauri, desktop on Windows and Linux.

### Where the data is kept (2026-11-14)

A file on each machine in any case. Options: SQLite (sturdy, easy queries, not readable by hand), or a plain CSV or
JSON file (readable and easy to back up, but easier to break). The handover file holds everything in one file, which
either choice can write. Also: is there a backup, and where? The handover file may serve as one.
**See:** One user, offline, on the owner's machines; Handover between machines.

### Look and feel (2026-11-14)

What the main screen is: one big start/stop button with today's total; a small always-on widget; an icon in the
system tray or menu bar. How much of the history is on the main screen, and where editing lives. Light, dark, or
following the system. To be settled with a sketch.
**See:** What the app does.

### Language of the app (2026-11-14)

English, Swedish, or the language the boss reads the report in. The school is Swedish-language, in Finland.

### How an errand is recorded (2026-11-14)

Today the owner writes errand time into Excel at the end of the day, not as it happens. Options: an "away" click and a
"back" click while an entry runs, or a stop and a new start (two entries, the gap between them being the errand). The
first keeps a day as one entry; the second needs no new control.
**See:** What the app does.

### The four buttons and switching profile (2026-11-14)

The owner's design draft has four buttons for the running profile: start day, end day, start break, end break. The
owner's first thought, not yet settled: profiles are self-contained, so switching to another profile puts the running
one on a break, and it goes on when the owner switches back. "End day" ends only the profile on screen. A profile
left on a break is closed by a date check: the next click on it on a later date ends the old day where its break
began, and starts a new one; on the same day it simply goes on. The agent's lean: the check covers a paused day only,
since its end is known; a day left running has no known end, which is "A forgotten stop". Open: whether a break is
the same as an errand, and lunch a break. It may change how "Profiles label the hours" words the switch.
**See:** Profiles label the hours; How an errand is recorded.

### Marking corrected entries (2026-11-14)

Whether the record and the report show that an entry was written by hand or edited. Showing it may make the report
more trustworthy to the boss; hiding it keeps the report clean.
**See:** What the app does.

### Bringing over the Excel history (2026-11-14)

Where the balance starts. Options: the app starts empty with the Excel balance carried over as one figure, or it
imports the past days from the file. Importing keeps the history in one place; carrying over is far simpler.
**See:** What the app does.

### Is "from home" a profile (2026-11-14)

Work from home is paid differently, but the owner may also do a task, such as development group work, from home.
Options: "from home" is a profile of its own (one list, one choice per entry, maybe "Dev from home" as a profile), or
a mark on any entry beside its profile (two choices per entry). One list is lighter to switch; a mark avoids a
profile for every task and place. The agent's lean: one list, since the owner adds profiles as they come up.
**See:** Profiles label the hours.

### Profile settings that change (2026-11-14)

If a profile's setting changes (say, its expected hours, or the ceiling), past days must not change with it. The agent's
lean: a change applies from a date onward, and each past day keeps the settings it was worked under. It shapes how
profiles are stored.
**See:** Profiles label the hours.

### Report period and content (2026-11-14)

Which period a report covers (a week, a month, any range), and what it shows: each day's start, stop, errands and
total, or only day totals and the period's total.
The owner's first answer (2026-11-14), not yet settled: a month, shown with the same two figures as the main screen,
the balance bar and the ceiling circle, each with its numbers, so the month can be read at a glance. For janitor work
the boss only needs to see that the balance is not too far over or under; for the other profiles, the exact hours per
profile, since their pay may differ.

## Phase 1

### A forgotten stop (2026-11-14)

If the owner forgets to stop, the entry runs on. Options: nothing (fix it by hand in Phase 4), a reminder after a
set time, or asking at the next start.
**See:** What the app does.

### Entries across midnight (2026-11-14)

Whether an entry that crosses midnight is split between the two days, or counted on the day it started. Rare, but it
changes the day totals.

## Phase 2

### Is lunch an errand (2026-11-14)

Whether lunch and other unpaid breaks are recorded the same way as errands, or kept apart in the report.

## Phase 3

### Working time limits (2026-11-14)

The figures for the ceiling, which the owner is asking the principal: which agreement covers the owner (the Working
Hours Act, KVTES, or another), what counts as full time, so the ceiling's amount and its period; whether the janitor
balance has a cap; and how the other profiles are paid, for their pay categories. They are settings, so they do not
block the build.
**See:** The other profiles share a ceiling.
