# Codebase ideas

Ideas that are not a problem now, one entry each, opening with **Returns when:** (the phase, feature or code that would
make it matter). Read at a docs sweep, when the owner asks about the subject, or when the owner says to. Problems in
what is built go to `open-questions.md` instead.

## Corrected entries in the report

**Returns when:** the Reports part is built.

The record marks each entry clicked, written by hand or edited ("Entries remember how they were made", in
`design-decisions/`). The report could show the mark, such as a small sign beside a hand-set time, so the boss sees
which times were set afterwards. Not vital: the record keeps the mark either way, and a clean report may read better.

## A tray icon, with autostart

**Returns when:** the owner wants to learn how a tray app is made, or opens the app many times a day just to see what

runs. An icon in the system tray: closing the window hides it instead of quitting; clicking the icon brings it back; its
menu offers start and stop; the icon could take the running profile's colour. With it, autostart becomes worth having,
the app starting at login into the tray only, through Tauri's autostart plugin (the Windows run-at-login entry, a file
in `~/.config/autostart/` on Linux). On GNOME, tray icons need an extension. Mainly a way for the owner to learn the
process; the app gains little ("A plain window app", in `design-decisions/`).

## Tab content growing out of its tab

**Returns when:** the menu is built.

Switching tabs in the menu ("The menu has two tabs, with every value locked behind "Ändra"", in `design-decisions/`)
starts as a fade. Something more playful to try: the new tab's content grows out of the tab that was clicked, as the
menu grows out of its button. To try in the menu's coding session, against the fade.

## Today's hours on the controls side

**Returns when:** the owner, using the app, keeps wondering how much is left of today.

A quiet line under the button block: today's hours of the profile with the balance against the day's expected hours
("Idag 3:52 av 6:00"), maybe as a slim bar, updated at stop like everything else. Only that profile has a daily target;
the others have the month's ceiling, which the wheel shows. The day's total already exists for the balance ("Day total"
in the glossary), so the line is small to add.

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
Until then the owner's cases, written first and seen red, and the hand count in Phase 1's **Done when** carry it.
