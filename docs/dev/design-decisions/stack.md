# Stack

What the app is built with. Each decision follows the template in `README.md`, and is cited by its title.

## Tauri, desktop on Windows and Linux (2026-11-14)

**Built by:** Clocking.

**Decision:** the app is built with Tauri: a web-style interface on the system's webview, with a Rust backend,
packaged as one small program for Windows and Linux.
**Why:** the app runs on the owner's Windows work computer and Linux home computer, and its interface has animation and
custom controls (the balance bar, the ceiling wheel, the clock picker) that a web-style interface makes easy. Tauri
gives a small program that starts fast, and the owner wants to try it. On Linux the webview is WebKitGTK, which can lag
on newer CSS and animation, so animations are tested on Linux early.
**Rejected:** Electron: the same Chromium everywhere, but a program of about 100 MB for a small tool. Python with
Tkinter or Qt: custom animated controls are harder. A local web page in the browser: browser storage can be wiped,
which is risky for a record the boss relies on. A phone app: the owner clicks at a computer.
**Revisit if:** WebKitGTK cannot show the interface acceptably on Linux.

## The record is one JSON file (2026-11-14)

**Built by:** Clocking; the handover file in Handover.

**Decision:** each machine keeps the record in one JSON file: profiles, settings, entries with their added breaks, and
opening figures, with a version number for its shape. A save writes a temporary file and then swaps it into place, so
a crash leaves the old file whole. On opening, the app checks the file and says plainly what is wrong rather than
guessing. The handover file is the same JSON. The ceiling wheel's and balance bar's colours are in a small settings
file of the machine's own, which is never exported. Once a day the app keeps a copy of the record beside it, and keeps
the last 14.
**Why:** the record has shape (entries hold breaks; settings change from a date), which JSON holds in one readable
file. At about four entries a day, ten years is a megabyte or two: rewriting it on each save and counting in memory are
instant. The swap makes the one real risk, a half-written file, cheap to avoid; the version number lets a newer app
read an older file. The handover being the same file makes export nearly free, and the colours' own file keeps them out
of it with no special rule. The copies cover a broken file, a bad hand edit or a stale import.
**Rejected:** SQLite: sturdy and quick to query, but not readable, and its queries go unused at this size. CSV: one flat
table per file, so the shape would need several files tied by IDs. No backup: one bad import could lose the record.
**Revisit if:** the file grows past what saves instantly, or the owner needs to query the history in ways memory cannot.
**Cases:**
- A crash during a save: on restart the file is the one before the save.
- The file edited by hand into invalid JSON: the app names the problem and offers yesterday's copy.
- Day 15 of daily copies: the oldest of the 14 is deleted.
