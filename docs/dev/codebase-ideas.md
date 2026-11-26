# Codebase ideas

Ideas that are not a problem now, one entry each, opening with **Returns when:** (the phase, feature or code that would
make it matter). Read at a docs sweep, when the owner asks about the subject, or when the owner says to. Problems in
what is built go to `open-questions.md` instead.

## Corrected entries in the report

**Returns when:** the Reports part is built.

The record marks each entry clicked, written by hand or edited ("Entries remember how they were made", in
`design-decisions/`), and the report already shows an edit's reason on a day it lists ("The report lists the days the
balance moved"). The report could also show the mark itself, such as a small sign beside a hand-set time on the days
page. Not vital: the reason already tells the boss a time was set afterwards, and a clean report may read better.

## Merging two machines' records at import

**Returns when:** the owner loses hours by clicking on one machine without importing first ("Handover between machines",
in `design-decisions/`).

An import that adds instead of replacing: every entry in the file that overlaps no local entry is added, which covers
both the newer entries and those worked on the other machine in the local record's gaps; an entry with the same id that
was edited on the other machine replaces the local one. Done properly it needs more than the entries: ids unique across
machines (today's `e1`, `e2` and `p1` collide, so the record's shape changes, with an upgrade), the deleted ids carried
in the file so an entry swallowed by docking on one machine does not come back from the other, a time on each change so
an entry edited on both machines has a newest, and the same for profiles, settings, flex days and opening figures. Too
big to slip into Handover, whose import replaces everything after asking.

## A tray icon, with autostart

**Returns when:** the owner wants to learn how a tray app is made, or opens the app many times a day just to see what

runs. An icon in the system tray: closing the window hides it instead of quitting; clicking the icon brings it back; its
menu offers start and stop; the icon could take the running profile's colour. With it, autostart becomes worth having,
the app starting at login into the tray only, through Tauri's autostart plugin (the Windows run-at-login entry, a file
in `~/.config/autostart/` on Linux). On GNOME, tray icons need an extension. Mainly a way for the owner to learn the
process; the app gains little ("A plain window app", in `design-decisions/`).

## Winding the wheel back by dragging

**Returns when:** the peek on the ceiling wheel proves unclear in use ("The ceiling wheel", in `design-decisions/`).

Grab the wheel and drag backwards: the ring unwinds as far as the drag goes, down to an empty wheel, and springs back to
full on release. It would replace the hover peek on the same wheel, and adds the month building up as it winds.

## An English translation

**Returns when:** someone who does not read Swedish wants to use the app ("The app is in Swedish", in

`design-decisions/`). The interface and the report in English beside Swedish, chosen per machine like the theme. The
name, TimeFold, is English already.

## Coverage and mutation testing, as one sweep

**Returns when:** a bug slips past the tests and is hard to find, or before the last phase is called done.

Install the tools then and sweep the whole codebase once: `@vitest/coverage-v8` (lines and branches reached) and
StrykerJS with its Vitest runner (whether breaking the code turns a test red) for TypeScript, `cargo-mutants` for Rust.
Mutation testing measures the rule in "Code style" that a test earns its place only if breaking its code turns it red.
Until then the owner's cases, written first and seen red, carry it.

## A second line beside the focus rings

**Returns when:** a profile's colour is hard to see as a focus ring, as a pale hue on the light controls side may be.

The focus rings wear where the profile on screen stands ("Each profile carries its colours"), and some colours barely
show on some surfaces. Measured over 36 hues, the share of bases and neons under 3:1: on the light controls side 28 and
23 of 36 (worst 1.38 and 1.00), on the light dashboard 6 and 12, on the dark controls 0 and 4, on the dark dashboard 0
and 3. No light background helps: the palest bases would need one brighter than white. What works is a thin second line
beside the coloured ring, and it must follow the surface, not the theme: dark on the light controls side, where the pale
colours fail, and light on the three dark surfaces, where the dark ones do; the other theme's controls background gives
the two colours. It cannot be a box-shadow, which would replace the start button's running ring while it has focus, and
an element has only one outline.

## A copy when the day changes while the app runs

**Returns when:** the app is left running across days, so the daily copies thin out.

The day's copy is made at start, from a file that has just passed the check ("The record is one JSON file"). An app left
running past midnight makes no copy for the new day until it is started again. The fix needs no question to the owner,
since a copy costs nothing and an identical one is dropped: at the first save after the date changes, the app hands Rust
its own record from memory, valid by construction, to write as the day's copy. Not built: the owner closes the app every
evening, and it would be a second way of making copies for a case that barely happens. Rejected for it: an offer on the
prune line ("no copy today, make one?"), a question whose only answer is yes.

## The app for the whole school

**Returns when:** the school wants the app for others, with time set aside for its development; until then the app stays
the owner's alone.

The app is built for the owner alone. A release for the school is a list of jobs, none needed while it stays the
owner's:

1. **What is whose.** One janitor balance, the owner's pay and report: what each person sets for themselves, and whether
   that changes the vision. Decided in design mode before anything below. The owner's picture: the first start offers a
   setup, Vaktmästare or Ledning to begin with, later perhaps Lärare, or students who want to track their study time and
   scroll less. A setup decides which settings the record starts with, and which of the app's parts it shows: for the
   owner the flex bar, the ceiling wheel, the edit and "Senaste"; for Ledning perhaps the ceiling wheel alone. A part
   shown has what it needs: no flex bar or flex calendar with no expected hours, no pay estimate with no pay. A variant
   of a part is an option on it, not a copy, and a part a new need turns up joins the set. Still one user per machine
   with their own record, and no shared state. Each new part's design pass asks whether it could stand alone
   (`AGENTS.md`, design mode); the refactor that slots the existing parts into setups comes before the rollout, once a
   real second setup draws the seams. Ledning is for staff who want to see how much they work at home: one profile and a
   target of hours, with the ceiling wheel working as it does, the target per working day over the month's weekdays,
   each month on its own, and raised for a busy month from a date. Open: what sets the wheel's amount with no full time,
   and what each later setup holds. Phase 4 is where the code stops assuming one janitor profile.
2. **Installing.** Ready: each release has an `.msi`, the form an IT department deploys, installing per machine, and the
   record is each Windows user's own ("The app reaches each machine as an installer from a GitHub release", in
   `design-decisions/`). The owner's own work machine then moves from the `.exe` to IT's `.msi`: the record exported
   first, the `.exe` uninstalled with its data kept, and the record found in place by the `.msi`. The home Windows keeps
   the `.exe` and tries each release before IT gets it.
3. **Signing.** Unsigned installers make Windows warn "Windows protected your PC" on a downloaded file. A certificate
   proves who published the installer, not that the app is good; nobody reviews the code. It is rented, not bought: an
   OV certificate costs about $220–450 a year (2026), on a hardware token or a cloud key, renewed at least every 460
   days; Microsoft's signing service is cheaper per month, but in 2026 took individuals only in the USA and Canada, so
   it would be the school's, as an organisation. Paid by the school, as it is its rollout. IT may skip it: an installer
   it deploys itself does not meet the download warning, and some IT departments sign with a certificate of their own.
   Asked of IT first.
4. **Hardening.** A Content Security Policy in `tauri.conf.json`, now `null`, tested against the pointer light and the
   fonts; the Rust side refusing a copy's date not shaped `YYYY-MM-DD`; two-factor login on the GitHub account the
   installers come from.
5. **Updating.** The updater, planned for the last phase, signs releases with a key of its own, kept out of the repo.
   For machines IT installs, IT may rather push each `.msi` itself; asked of IT.
6. **Upkeep.** Who answers questions and fixes faults, and on whose time. Agreed with the school before the rollout,
   with what upkeep covers (faults, new Windows versions, small requests) and what is new work.
7. **Phones.** The others want it on Android or iPhone. Tauri builds the same app for both: Android on the owner's Linux
   machine, handed out as a local install such as through Wilma, after asking IT; iOS needs a Mac to build on, and
   reaches iPhones only through Apple's own channels. How the record moves with no second machine to carry a file to is
   open. The agent's lean: Android first.
