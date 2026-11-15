# Stack

What the app is built with. Each decision follows the template in `README.md`, and is cited by its title.

## Tauri, desktop on Windows and Linux (2026-11-14)

**Built by:** Clocking, for the program on Windows.

**Decision:** the app is built with Tauri: a web-style interface on the system's webview, with a Rust backend, packaged
as one small program for Windows and Linux.

**Why:** the app runs on the owner's Windows work computer and Linux home computer, and its interface has animation and
custom controls (the flex bar, the ceiling wheel, the clock picker) that a web-style interface makes easy. Tauri gives a
small program that starts fast, and the owner wants to try it. On Linux the webview is WebKitGTK, which can lag on newer
CSS and animation, so animations are tested on Linux early.

**Rejected:** Electron: the same Chromium everywhere, but a program of about 100 MB for a small tool. Python with
Tkinter or Qt: custom animated controls are harder. A local web page in the browser: browser storage can be wiped, which
is risky for a record the boss relies on. A phone app: the owner clicks at a computer.

**Revisit if:** WebKitGTK cannot show the interface acceptably on Linux.

## Svelte with TypeScript for the interface (2026-11-14)

**Decision:** the interface inside Tauri is written in Svelte, with TypeScript for its logic and plain CSS in each
component's own style block. No CSS framework. It is plain Svelte built by Vite, one page mounted from `src/main.ts`,
not SvelteKit.

**Why:** the main screen is a few live figures that follow the data and animate as it changes; Svelte keeps the screen
in step with the data and has tweened values and transitions built in (a number counting up, an element animating in or
out), where plain TypeScript would need that wiring by hand. Its components are written in TypeScript, which the owner
knows, and their CSS is ordinary CSS, scoped to the component, which the owner enjoys writing. It is a modern tool the
owner wants to learn, and its idea, components that follow the data, carries over to other frameworks.

**Rejected:** plain TypeScript: every update and animation would be wired by hand. React: more machinery than an app
this size needs. A CSS framework such as Tailwind: the owner prefers writing the CSS. SvelteKit: its routing and server
rendering are for websites; one window uses neither, and Tauri's SvelteKit template spends its config turning them off
(`ssr = false`, a static adapter).

**Revisit if:** Svelte's animation does not run well on WebKitGTK, or the build step costs more than it gives.

## The record is one JSON file (2026-11-14)

**Built by:** Clocking; the handover file in Handover.

**Decision:** each machine keeps the record in one JSON file: profiles, settings, entries with their added breaks, and
opening figures, with a version number for its shape. A save writes a temporary file and then swaps it into place, so a
crash leaves the old file whole. On opening, the app checks the file and says plainly what is wrong rather than
guessing. The handover file is the same JSON. The theme is in a small settings file of the machine's own, which is never
exported; the profiles' colours are in the record. Once a day the app keeps a copy of the record beside it, and keeps
the last 14.

**Why:** the record has shape (entries hold breaks; settings change from a date), which JSON holds in one readable file.
At about four entries a day, ten years is a megabyte or two: rewriting it on each save and counting in memory are
instant. The swap makes the one real risk, a half-written file, cheap to avoid; the version number lets a newer app read
an older file. The handover being the same file makes export nearly free, and the colours' own file keeps them out of it
with no special rule. The copies cover a broken file, a bad hand edit or a stale import.

**Rejected:** SQLite: sturdy and quick to query, but not readable, and its queries go unused at this size. CSV: one flat
table per file, so the shape would need several files tied by IDs. No backup: one bad import could lose the record.

**Revisit if:** the file grows past what saves instantly, or the owner needs to query the history in ways memory cannot.

**Cases:**

- A crash during a save: on restart the file is the one before the save.
- The file edited by hand into invalid JSON: the app names the problem and offers yesterday's copy.
- Day 15 of daily copies: the oldest of the 14 is deleted.
