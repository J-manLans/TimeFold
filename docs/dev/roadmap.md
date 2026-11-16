# Roadmap

What comes next, the state of what is built, the phases, and what is not on the roadmap. Read every session. Nothing
done stays here: a finished step is removed, and what was done goes in the commit message. **Next** says what comes
next, not the branch name.

## Next

Phase 1: Clocking, the owner's look at the controls side in the running app; then step 1, the dashboard.

## State

"Has it run" is _written_ (never run) or _run_ (executed by a script, a person or the system). Written is not run.

| Part                                                                                                                | State   | Has it run                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| The project: Tauri, Svelte and Vite, with an empty main screen                                                      | written | run: the window opens on Linux                                                                             |
| The tools: Prettier, ESLint, rustfmt, clippy and Vitest, run by `tidy` and `test`                                   | written | run: `tidy` passes; `test` ran a throwaway pass and fail                                                   |
| The design tokens and the two fonts, from the prototype                                                             | written | run: the window shows the text font on the theme's background                                              |
| The record: types, the check on opening, the safe save and daily copies, `loadRecord` and `saveRecord`              | written | run: in tests; and in the app, which made `record.json` on the owner's machine and read it back on restart |
| The counting: each day's seconds, expected hours, a day's result, the balance, the month, the minutes shown         | written | run: in tests only (20, in four time zones); no screen shows it yet                                        |
| The controls side: start, stop and undo, the button block, the status line, the undo's label, the prune line's room | written | run: the rules in tests; the screen not yet seen in the app window                                         |
| The colour rule, from the prototype                                                                                 | written | run: in tests only                                                                                         |
| The menu's fold-out, the theme button, and the machine's settings file                                              | written | run: the settings in tests; the menu not yet seen in the app window                                        |
| The pointer light                                                                                                   | written | written: not yet seen in the app window                                                                    |

## The phases

In this order because each builds on the one before, and so the app can be tried on real days early: clocking first,
then what a real day needs (breaks, then putting mistakes right), then the other work, then the second machine, then the
report. The owner keeps the Excel file until the switch after Phase 6 ("A first install starts fresh or imports", in
`design-decisions/`). Every phase starts its code from the owner's cases ("Tests come first, from the owner's rules"),
and tests animation on Linux early ("Tauri, desktop on Windows and Linux").

### Phase 1: Clocking

**Produces:** an app that starts, stops and keeps janitor work, with the balance in view.

**Settle first:** the screens the prototype does not show yet, drawn in design mode with their cases: the onboarding,
the screen for a record that cannot be read, and the question for a running entry from an earlier day; the folders for
the dashboard and for those screens; and how Windows is checked for **Done when**, as there is no dev setup on it.

1. The dashboard with the flex bar and the five recent entries.
2. The onboarding, Phase 1's part of it ("A first install starts fresh or imports"). An app with no record opens on a
   welcome screen with two choices: "Starta nytt", and "Importera från min andra dator", shown but greyed out until
   Phase 5. "Starta nytt" then asks, one screen at a time:
   1. the first profile's name: the profile with the balance, such as "Vaktmästare";
   2. the balance brought over from the Excel file, as it stood the evening before the first day in the app.

   Then the main screen opens with that balance on the bar. Phase 4 adds a step for the ceiling hours already used this
   month, and Phase 5 makes the import choice work. A record that cannot be read opens on a screen naming the problem
   and offering the newest daily copy, which needs commands to list the copies and read one.

3. The question for a running entry from an earlier day.

**Done when:** the owner clocks real days with it on one machine and the balance matches a hand count; the screen
matches the prototype in both themes on Windows and Linux.

### Phase 2: Breaks and flex days

**Produces:** time away taken off the day, and days off paid for with the balance.

**Settle first:** where a flex day is marked (`open-questions.md`), and the flex day drawn in the prototype.

1. "Lägg till paus" with its length field, and the break tags in the entry list.
2. Flex days, for a day or a range, taken off the balance.

**Done when:** a day with errands and a flex day count as agreed in their cases, checked against the owner's Excel.

### Phase 3: Corrections

**Produces:** a record that can be put right: entries edited on their line, deleted, or written by hand.

**Settle first:** joining two entries; deleting and writing a forgotten entry; exact minutes on the line
(`open-questions.md`); editing an entry on its line, drawn in the prototype (its "Visa alla" popup only notes where it
goes).

1. The "Visa alla" popup with every entry.
2. Editing an entry on its line: handles, the zoom, gaps and shortening, the confirm.
3. Deleting, and writing a forgotten entry; each entry's mark of how it was made.

**Done when:** a forgotten start, a late stop and an errand found afterwards are each fixed in a few clicks, and the
balance follows.

### Phase 4: Profiles

**Produces:** every kind of work counted apart, the ceiling wheel, and the menu.

**Settle first:** how the full-time slider is drawn.

1. Profiles: the profile button and its popup, each profile's colours with the largest gap, "Ny profil", archiving; the
   warning label on the start button while another profile runs.
2. The ceiling, its carry into the next month, and the ceiling wheel in the profile on screen's colours.
3. The menu: the two tabs, counting values locked behind "Ändra" with "Tidigare värden"; settings that change from a
   date.
4. The pay estimate; the onboarding's step for the ceiling hours already used this month.
5. Pruning on request ("Old history is pruned on request"), once the ceiling's carry exists: the prune itself and the
   offer on the prune line, tested with set dates rather than waiting three years.

**Done when:** a month mixing janitor and development group work shows the right balance, ceiling and estimate, and
every setting changes from a date as its cases say, and a prune on a set date cuts as its cases say.

### Phase 5: Handover

**Produces:** the record moving between the work and home machines.

**Settle first:** the question before an import replaces the record, drawn in the prototype (its import button only
shows a note).

1. Export and import of the record, asking before it replaces anything; the profiles' colours travel, the theme stays.
2. The onboarding's "Importera från min andra dator": it reads a handover file and asks nothing more.

**Done when:** a week worked on both machines, handed over each day, matches on both.

### Phase 6: Reports

**Produces:** the monthly report to the boss, as a PDF.

**Settle first:** how the PDF is made in Tauri; where the report is made from (`open-questions.md`), and that screen
drawn in the prototype.

1. The month's report: name and month, the flex bar and the ceiling wheel with their carried amounts, hours per profile
   by pay category.
2. The export option for each day's hours.

**Done when:** the owner sends a real month's report and it reads without explanation. Then the owner switches from
Excel: a fresh start with the opening figures, on a day not yet worked. Once the app is validated in that use, the
prototype goes.

## Not on this roadmap

- More than one user, accounts, or sync between machines beyond the handover file.
- Tracking tasks finer than profiles: no projects, task lists or clients.
- Calculating pay as payroll does, overtime rules or invoicing: the app counts hours per profile and shows a rough pay
  estimate; real pay is worked out outside it.
