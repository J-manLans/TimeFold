# Open questions

What is not decided, grouped under the phase that needs the answer (before the roadmap is agreed, the part), so a
phase's **Settle first** can point here.
Each entry: what is known, the options, the date raised, and **See:** the decisions it touches. An answered question
leaves; its answer goes to `design-decisions/`. A question half answered stays with what is left of it.

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

Known: one start/stop button with the profile list beside it, the bars, and today's entries listed under them ("One
start/stop button and a profile list"; "Time away is a gap or an added break"); editing opens from that list ("Editing
an entry on its line"); the balance bar and the ceiling wheel ("The ceiling wheel"). Open: whether there is also a
small always-on widget or an icon in the system tray, how the settings menu and the slider that splits full time look,
where the pay estimate shows, how much earlier history the main screen shows. Light, dark, or following the system. To be settled with a sketch.
**See:** What the app does.

### Language of the app (2026-11-14)

English, Swedish, or the language the boss reads the report in. The school is Swedish-language, in Finland.

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

### Report period and content (2026-11-14)

Which period a report covers (a week, a month, any range), and what it shows: each day's start, stop, errands and
total, or only day totals and the period's total.
The owner's first answer (2026-11-14), not yet settled: a month, shown with the same two figures as the main screen,
the balance bar and the ceiling wheel, each with its numbers, so the month can be read at a glance. For janitor work
the boss only needs to see that the balance is not too far over or under; for the other profiles, the exact hours per
profile, since their pay may differ.

## Part: Corrections

### Joining two entries (2026-11-14)

Removing a gap between two entries, such as after a stop and start by mistake. Options: dragging one entry's handle
to meet the other on the line, which then join; or a "join" action on two neighbouring entries of the same profile.
**See:** Editing an entry on its line.

### Deleting an entry, and writing a forgotten one (2026-11-14)

How an entry is removed, and how a whole forgotten entry is written by hand. A new entry could be drawn on a line in
free time, with the same stops at other entries and midnight.
**See:** Editing an entry on its line.

### Exact minutes on the line (2026-11-14)

Whether the handles snap (such as to 5 minutes), and whether a time can also be typed or set with the clock for
precision. The draft's clock picker was meant for editing; the line may replace it there, or work beside it.
**See:** Editing an entry on its line.

