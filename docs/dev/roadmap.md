# Roadmap

What comes next, the state of what is built, the phases, and what is not on the roadmap. Read every session. Nothing
done stays here: a finished step is removed, and what was done goes in the commit message. **Next** says what comes
next, not the branch name.

## Next

Phase 1: Clocking, its **Settle first**, for the steps left: how Windows is checked first.

## State

"Has it run" is _written_ (never run) or _run_ (executed by a script, a person or the system). Written is not run.

| Part                                                                                                                                                     | State   | Has it run                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------- |
| The project: Tauri, Svelte and Vite, with an empty main screen                                                                                           | written | run: the window opens on Linux                                                                                              |
| The tools: Prettier, ESLint, rustfmt, clippy and Vitest, run by `tidy` and `test`                                                                        | written | run: `tidy` passes; `test` ran a throwaway pass and fail                                                                    |
| The design tokens and the two fonts, from the prototype                                                                                                  | written | run: the window shows the text font on the theme's background                                                               |
| The record: types, the check on opening, the safe save and daily copies, `loadRecord` and `saveRecord`                                                   | written | run: in tests; and in the app, which made `record.json` on the owner's machine and read it back on restart                  |
| The counting: each day's seconds, expected hours, a day's result, the balance, the month, the minutes shown                                              | written | run: in tests only (20, in four time zones); the dashboard shows the balance, not yet seen                                  |
| The controls side: start, stop and undo, the button block, the status line, the undo's label, the prune line's room                                      | written | run: the rules in tests; and in the app window on Linux, where the owner clocked entries and found them saved in the record |
| The colour rule, from the prototype                                                                                                                      | written | run: in tests only                                                                                                          |
| The menu's fold-out, the theme button, and the machine's settings file                                                                                   | written | run: the settings in tests; the menu in the app window on Linux                                                             |
| The pointer light                                                                                                                                        | written | run: in the app window on Linux                                                                                             |
| The dashboard: the balance and the flex bar, the ceiling wheel and the pay estimate, the five recent entries, "Visa alla" and its popup                  | written | run: the rules in tests; the record's upgrade and the screen in the app window on Linux, which the owner found right        |
| The onboarding: the locked panel, the balance and the name, the record saved on the name, the ending with its sweep                                      | written | run: the duration rules in tests; the screen not yet seen                                                                   |
| The recovery: the daily copy at start (31 kept, none the same as the newest), the screen for a record that cannot be read with the copy on the dashboard | written | run: the copy rules in Rust tests, the newest copy and the recovery's choice in tests; the screen not yet seen              |

## The phases

In this order because each builds on the one before, and so the app can be tried on real days early: clocking first,
then what a real day needs (breaks, then putting mistakes right), then the other work, then the second machine, then the
report. The owner keeps the Excel file until the switch after Phase 6 ("A first install starts fresh or imports", in
`design-decisions/`). Every phase starts its code from the owner's cases ("Tests come first, from the owner's rules"),
and tests animation on Linux early ("Tauri, desktop on Windows and Linux").

### Phase 1: Clocking

**Produces:** an app that starts, stops and keeps janitor work, with the balance in view.

**Settle first:** the screens the prototype does not show yet, drawn in design mode with their cases: the question for a
running entry from an earlier day; the folders for those screens, once they are drawn.

1. The question for a running entry from an earlier day.
2. The release ("The app reaches each machine as an installer from a GitHub release"): the GitHub action building the
   Windows and Linux installers from a version tag, `docs/dev/procedures/release.md`, and `v0.1.0`.

   The owner makes the `v0.1.0` release by hand, start to finish: raising the version, pushing the tag, publishing the
   draft. It is the owner's first release, a step in their developer career, and the agent only guides. Something to
   celebrate with stands ready, chilled, before the tag is pushed.

**Done when:** the owner clocks real days with it on one machine and the balance matches a hand count; the screen
matches the prototype in both themes on Windows and Linux, Windows checked by installing the `v0.1.0` release.

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

1. Editing an entry on its line, opened from the recent entries and the "Visa alla" popup: handles, the zoom, gaps and
   shortening, the confirm; the rows' hover with it.
2. Deleting, and writing a forgotten entry; each entry's mark of how it was made.

**Done when:** a forgotten start, a late stop and an errand found afterwards are each fixed in a few clicks, and the
balance follows.

### Phase 4: Profiles

**Produces:** every kind of work counted apart, the ceiling wheel, and the menu.

**Settle first:** how the full-time slider is drawn.

1. Profiles: the profile button and its popup, each profile's colours with the largest gap, "Ny profil", archiving; the
   warning label on the start button while another profile runs.
2. The ceiling's opening hours, once whose they are is settled.
3. The menu: the two tabs, counting values locked behind "Ändra" with "Tidigare värden"; settings that change from a
   date.
4. Pruning on request ("Old history is pruned on request"), once the ceiling's carry exists: the prune itself and the
   offer on the prune line, tested with set dates rather than waiting three years.

**Done when:** a month mixing janitor and development group work shows the right balance, ceiling and estimate, and
every setting changes from a date as its cases say, and a prune on a set date cuts as its cases say.

### Phase 5: Handover

**Produces:** the record moving between the work and home machines.

**Settle first:** the question before an import replaces the record, drawn in the prototype (its import button only
shows a note).

1. Export and import of the record, asking before it replaces anything; the profiles' colours travel, the theme stays.
2. The onboarding's "Importera": it reads a handover file and asks nothing more.

**Done when:** a week worked on both machines, handed over each day, matches on both.

### Phase 6: Reports

**Produces:** the monthly report to the boss, as a PDF.

**Settle first:** how the PDF is made in Tauri; where the report is made from (`open-questions.md`), and that screen
drawn in the prototype.

1. The month's report: name and month, the flex bar and the ceiling wheel with their carried amounts, hours per profile
   by pay category.
2. The export option for each day's hours.
3. The updater: the app notices a new release and offers to install it.

**Done when:** the owner sends a real month's report and it reads without explanation. Then the owner switches from
Excel: a fresh start with the opening figures, on a day not yet worked. Once the app is validated in that use, the
prototype goes.

## Not on this roadmap

- More than one user, accounts, or sync between machines beyond the handover file.
- Tracking tasks finer than profiles: no projects, task lists or clients.
- Calculating pay as payroll does, overtime rules or invoicing: the app counts hours per profile and shows a rough pay
  estimate; real pay is worked out outside it.
