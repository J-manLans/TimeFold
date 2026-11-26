# Roadmap

What comes next, the phases with how far each step has got, the phases done, and what is not on the roadmap. Read every
session. Nothing done stays here but a line per finished phase: a step is removed once it is seen working, and what was
done goes in the commit message. **Next** says what comes next, not the branch name; work outside a phase, such as a
patch, is a step under it.

A step's tags, at its start, say how far it has got; they stack, each added as it comes true, none taken away. Written
is not run.

- No tag: not written yet.
- `[written]`: the code exists.
- `[tests]`: run in tests.
- `[seen: <where>]`: seen working, and where: `[seen: linux]`, `[seen: windows]`, `[seen: release]`.

A step is removed once it is seen everywhere it has to work, which is the owner's Linux machine unless a short note
after the step names more. A phase whose steps are gone and whose **Done when** holds goes too, leaving one line under
**Done**: its name, what it produced, and its release, so what a past phase held is found in its release's commits.

## Next

Phase 4: Profiles, its build; its design pass is done. The owner names the mode.

## The phases

In this order because each builds on the one before, and so the app can be tried on real days early: clocking first,
then what a real day needs (breaks, then putting mistakes right), then the other work, then the second machine, then the
report, and last what carries over to the owner's next project. The owner switches to the app with Phase 1's release and
keeps the Excel file as a backup until the app is finished ("A first install starts fresh or imports", in
`design-decisions/`). Every phase starts its code from the owner's cases ("Tests come first, from the owner's rules"),
and tests animation on Linux early ("Tauri, desktop on Windows and Linux").

### Phase 4: Profiles

**Produces:** every kind of work counted apart, the ceiling wheel, and the menu.

1. `[written]` `[tests]` Profiles: the profile button and its popup, each profile's colours with the largest gap, "Ny
   profil" with its names each used once, archiving and deleting, and "Arkiverade"; the warning label on the start
   button while another profile runs.
2. `[written]` `[tests]` The menu: the Profiler tab, the full-time slider in Tid, counting values locked behind "Ändra"
   with "Tidigare värden"; settings that change from a date, full time and the split opening on the 1st of next month.
3. Pruning on request ("Old history is pruned on request"), once the ceiling's trend exists: the prune itself and the
   offer on the prune line, tested with set dates rather than waiting three years.
4. `[written]` One pointer-light rule for every button that catches it, given once as a shared class or rule, in place
   of the copies in `ButtonBlock`, `PauseField` and `ChoiceButton`, so no button catches it differently; the phase's new
   buttons use it ("The look: a fresh display face, mono text and soft buttons").
5. `[written]` The edit's "Lägg till paus" drawn as the "paus" tag, and every clickable tag's border lighting under the
   pointer ("An edited entry's break").
6. `[written]` `[tests]` Each month of the ceiling counted on its own, the carry taken out of the counting and the wheel
   ("The other profiles share a ceiling", "The ceiling wheel"); the ceiling's trend beside the pay estimate ("The
   ceiling's trend").
7. `[written]` `[tests]` The reason list learns an "Annan orsak" text written three times, each reason is edited or
   removed under its pen, and the list stops at seven lines ("Every edit carries a reason").

**Done when:** a month mixing janitor and development group work shows the right balance, ceiling and estimate, and
every setting changes from a date as its cases say, and a prune on a set date cuts as its cases say.

### Phase 5: Handover

**Produces:** the record moving between the work and home machines.

**Settle first:** the question before an import replaces the record (`open-questions.md`), drawn in the prototype (its
import button only shows a note).

1. Export and import of the record, asking before it replaces anything; the profiles' colours travel, the theme stays.
2. The onboarding's "Importera": it reads a handover file and asks nothing more.

**Done when:** a week worked on both machines, handed over each day, matches on both.

### Phase 6: Reports

**Produces:** the monthly report to the boss, as a PDF.

**Settle first:** how the PDF is made in Tauri; where the report is made from (`open-questions.md`), and that screen
drawn in the prototype; everything the PDF shows, its pages with the flex bar, the ceiling wheel, the days the balance
moved and the "Små avvikelser" line, drawn in the prototype.

1. The month's report: name and month, the flex bar with its carried balance, the ceiling wheel and the ceiling's trend,
   hours per profile with each one's pay kind; the days the balance moved, with flex days, edit reasons and the "Små
   avvikelser" line.
2. The export option for each day's hours.
3. The updater: the app notices a new release and offers to install it.

**Done when:** the owner sends a real month's report and it reads without explanation. Then the Excel backup goes, and
the app is `1.0.0`. Once the app is validated in that use, the prototype goes.

### Phase 7: Carry-over

**Produces:** a folder of TimeFold's general shapes, made for no project yet, that the owner's next project starts from.
The first one in view is the owner's monthly budget, now an Excel sheet, but the folder is not shaped for it.

**Settle first:** which parts carry over; where the folder lives (in this repo or a repository of its own, agreed before
it is made); what the general names are once TimeFold's are gone. Candidates, not yet chosen: the flex bar as a plain
over-and-under bar, settings that change from a date, the record with its safe save and daily copies, the design tokens
and the look, the menu with its locked values, and the field for entering a length.

1. Each chosen part lifted into the folder with its tests, its TimeFold names and rules taken out.
2. A prompt in the same folder, written with the owner, describing the next project for the agent that starts it. It
   stays with the folder. For the budget, what the owner has said so far: income and expenses per month, with recurring
   items; the stock and fund portfolio, kept as holdings and their counts, valued by an "Uppdatera kurser" button that
   fetches prices with no login, saved as a dated snapshot per month, a failed price typed by hand; and a savings goal
   showing the monthly target and what was actually saved.

**Done when:** the folder's tests pass on their own, nothing in its code names TimeFold's work, profiles or hours, the
owner has read it through and knows what each part is for, and the prompt reads as the owner means it.

## Done

- **Phase 0: Questioning.** The vision, the decisions, the stack and the prototype; no code.
- **Phase 1: Clocking.** An app that starts, stops and keeps janitor work, with the balance in view; it laid the
  foundation: the Tauri project, the tools, the record and its save, and the first screen. Released as `v0.1.0`.
- **Phase 2: Breaks and flex days.** Time away taken off the day, and days off paid for with the balance. Released as
  `v0.2.0`.
- **Phase 3: Corrections.** A record that can be put right: entries edited on their line, deleted, or written by hand in
  their gap, each with its reason and its mark, and the balance following. Released as `v0.3.0`.

## Not on this roadmap

- More than one user per machine, accounts, shared state, or sync between machines beyond the handover file. Setups for
  others at the school, each on their own machine, are "The app for the whole school", in `codebase-ideas.md`.
- Tracking tasks finer than profiles: no projects, task lists or clients.
- Calculating pay as payroll does, or invoicing: the app counts hours per profile and shows a rough pay estimate; real
  pay is worked out outside it. Overtime in the estimate comes in a later phase ("Overtime pay in the estimate", in
  `open-questions.md`).
