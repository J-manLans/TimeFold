# Codebase ideas

Ideas that are not a problem now, one entry each, opening with **Returns when:** (the phase, feature or code that
would make it matter). Read at a docs sweep, when the owner asks about the subject, or when the owner says to.
Problems in what is built go to `open-questions.md` instead.

## Corrected entries in the report

**Returns when:** the Reports part is built.
The record marks each entry clicked, written by hand or edited ("Entries remember how they were made", in
`design-decisions/`). The report could show the mark, such as a small sign beside a hand-set time, so the boss sees
which times were set afterwards. Not vital: the record keeps the mark either way, and a clean report may read better.

## A matte glow that follows the pointer

**Returns when:** the buttons are built, or the owner says to try it on the sketch.
On every button, the soft shading ("The look: a fresh display face, mono text, grain and soft buttons", in
`design-decisions/`) could sit where the pointer is, moving with it across the face, as if a lamp were held over the
part. To try as an experiment; the fixed light from the top is the baseline.

## A tray icon, with autostart

**Returns when:** the owner wants to learn how a tray app is made, or opens the app many times a day just to see what
runs.
An icon in the system tray: closing the window hides it instead of quitting; clicking the icon brings it back; its
menu offers start and stop; the icon could take the running profile's colour. With it, autostart becomes worth having,
the app starting at login into the tray only, through Tauri's autostart plugin (the Windows run-at-login entry, a file
in `~/.config/autostart/` on Linux). On GNOME, tray icons need an extension. Mainly a way for the owner to learn the
process; the app gains little ("A plain window app", in `design-decisions/`).
