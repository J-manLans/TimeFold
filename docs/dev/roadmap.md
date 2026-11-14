# Roadmap

What comes next, the state of what is built, the phases, and what is not on the roadmap. Read every session. Nothing
done stays here: a finished step is removed, and what was done goes in the commit message. **Next** says what comes
next, not the branch name.

## Next

Phase 1: Clocking, starting with its **Settle first**: the project's layout and the code map, and the design tokens
taken over from the main screen sketch.

## State

"Has it run" is *written* (never run) or *run* (executed by a script, a person or the system). Written is not run.

| Part | State | Has it run |
|---|---|---|
| _none yet_ | | |

## The phases

In this order because each builds on the one before, and so the app can be tried on real days early: clocking first,
then what a real day needs (breaks, then putting mistakes right), then the other work, then the second machine, then
the report. The owner keeps the Excel file until the switch after Phase 6 ("A first install starts fresh or imports",
in `design-decisions/`). Every phase starts its code from the owner's cases ("Tests come first, from the owner's
rules"), and tests animation on Linux early ("Tauri, desktop on Windows and Linux").

### Phase 1: Clocking

**Produces:** an app that starts, stops and keeps janitor work, with the balance in view.
**Settle first:** the project's layout and the code map; the design tokens taken over from the main screen sketch.
1. The project: Tauri, Svelte with TypeScript, the test runner, the code map.
2. The record: one JSON file with a version number, the safe save, the check on opening, daily copies.
3. The counting, as tested functions: entries, days, expected hours, the balance, the month start.
4. The main screen's control side: the button block, the warning label, the status line, the prune line's room.
5. The figures side with the balance bar and the five recent entries; the theme button; the colour rule, which the
   bar needs for its over colour.
6. The onboarding, Phase 1's part of it ("A first install starts fresh or imports"). An app with no record opens on
   a welcome screen with two choices: "Starta nytt", and "Importera från min andra dator", shown but greyed out until
   Phase 5. "Starta nytt" then asks, one screen at a time:
   1. the first profile's name: the profile with the balance, such as "Vaktmästare";
   2. its colours: a base colour (soft orange offered), with the over colour suggested from it;
   3. the balance brought over from the Excel file, as it stood the evening before the first day in the app.
   Then the main screen opens with that balance on the bar. Phase 4 adds a step for the ceiling hours already used
   this month, and Phase 5 makes the import choice work.
7. The question for a running entry from an earlier day.
**Done when:** the owner clocks real days with it on one machine and the balance matches a hand count; the screen
matches the sketch in both themes on Windows and Linux.

### Phase 2: Breaks and flex days

**Produces:** time away taken off the day, and days off paid for with the balance.
**Settle first:** where a flex day is marked (`open-questions.md`).
1. "Lägg till paus" with its length field, and the break tags in the entry list.
2. Flex days, for a day or a range, taken off the balance.
**Done when:** a day with errands and a flex day count as agreed in their cases, checked against the owner's Excel.

### Phase 3: Corrections

**Produces:** a record that can be put right: entries edited on their line, deleted, or written by hand.
**Settle first:** joining two entries; deleting and writing a forgotten entry; exact minutes on the line
(`open-questions.md`).
1. The "Visa alla" popup with every entry.
2. Editing an entry on its line: handles, the zoom, gaps and shortening, the confirm.
3. Deleting, and writing a forgotten entry; each entry's mark of how it was made.
**Done when:** a forgotten start, a late stop and an errand found afterwards are each fixed in a few clicks, and the
balance follows.

### Phase 4: Profiles

**Produces:** every kind of work counted apart, the ceiling wheel, and the menu.
**Settle first:** how the full-time slider is drawn.
1. Profiles: the profile button and its popup, each profile's colours with the largest gap, "Ny profil", archiving.
2. The ceiling, its carry into the next month, and the ceiling wheel in the profile on screen's colours.
3. The menu: its fold-out, the two tabs, counting values locked behind "Ändra" with "Tidigare värden"; settings that
   change from a date.
4. The pay estimate; the onboarding's step for the ceiling hours already used this month.
**Done when:** a month mixing janitor and development group work shows the right balance, ceiling and estimate, and
every setting changes from a date as its cases say.

### Phase 5: Handover

**Produces:** the record moving between the work and home machines.
**Settle first:** nothing open.
1. Export and import of the record, asking before it replaces anything; the profiles' colours travel, the theme stays.
2. The onboarding's "Importera från min andra dator": it reads a handover file and asks nothing more.
**Done when:** a week worked on both machines, handed over each day, matches on both.

### Phase 6: Reports

**Produces:** the monthly report to the boss, as a PDF.
**Settle first:** how the PDF is made in Tauri.
1. The month's report: name and month, the balance bar and the ceiling wheel with their carried amounts, hours per
   profile by pay category.
2. The export option for each day's hours.
**Done when:** the owner sends a real month's report and it reads without explanation. Then the owner switches from
Excel: a fresh start with the opening figures, on a day not yet worked.

## Later

Decided, but needed only once the app has been in use for years:
- Pruning old history on request ("Old history is pruned on request"), three years after the first install.

## Not on this roadmap

- More than one user, accounts, or sync between machines beyond the handover file.
- Tracking tasks finer than profiles: no projects, task lists or clients.
- Calculating pay as payroll does, overtime rules or invoicing: the app counts hours per profile and shows a rough pay
  estimate; real pay is worked out outside it.
