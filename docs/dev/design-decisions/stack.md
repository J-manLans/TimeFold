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

## Rust touches the disk; TypeScript knows the record (2026-11-15)

**Decision:** the Rust half reads and writes files and knows nothing of what they hold: reading the record, the safe
save, and the daily copies, each a Tauri command. The TypeScript half knows what a record is (its shape, its version,
the check on opening, the counting) and reaches the disk only through those commands, with `invoke`.

**Why:** the owner wants to learn Rust, and this is a small, well-bounded first piece of it. Rust can also force a write
onto the disk before the swap, which Tauri's file plugin cannot (its file handles have no sync, checked on version
2.7.1). The meaning of the record stays in one language, tested with Vitest; the disk work is small and tested beside
its Rust code.

**Rejected:** the file plugin from TypeScript, with no Rust of the owner's own: the usual way for a small Tauri app, and
nearly as safe, but it cannot force the write, and it would leave Rust untried.

**Revisit if:** the Rust half grows meaning of its own, or the owner wants one language after all.

## The record is one JSON file (2026-11-15)

**Built by:** Clocking, for the copy made at start and the screen for a record that cannot be read; Handover, for the
handover file.

**Decision:** each machine keeps the record in one JSON file, `record.json` in the app's data folder (named by the app's
identifier): profiles, settings, entries with their added breaks, and opening figures, with a version number for its
shape. A save writes a temporary file, forces it onto the disk, and then swaps it into place, so a crash leaves the old
file whole. On opening, the app checks the file and says plainly what is wrong rather than guessing: a file that is not
valid JSON, or not a record's shape, is named as such and the newest copy is offered ("A record that cannot be read
offers the newest copy"). No file at all means no record yet, and the welcome screen opens ("A first install starts
fresh or imports"). A file of an older version is upgraded to the current shape; a file of a newer version, at opening
or at import, is refused with a plain message to update the app on this machine first, and left untouched. The handover
file is the same JSON. The theme, and the profile last on screen ("The app opens on the running profile, or the last one
on screen"), are in a small settings file of the machine's own, which is never exported; the profiles' colours are in
the record. On each day the app starts, once the file has passed the check, it is copied into `copies/`, a folder beside
it, unless that day already has a copy or the file is the same as the newest copy; saves copy nothing. The last 31
copies are kept, however many days they span.

**Why:** the record has shape (entries hold breaks; settings change from a date), which JSON holds in one readable file.
At about four entries a day, ten years is a megabyte or two: rewriting it on each save and counting in memory are
instant. The swap makes the one real risk, a half-written file, cheap to avoid; forcing the write first keeps a crash
just after the swap from leaving an empty file. The version number lets a newer app read an older file, and refusing a
newer one keeps an older app from saving it back without the fields it does not know, since the shape changes with most
phases. The handover being the same file makes export nearly free, and the colours' own file keeps them out of it with
no special rule. The copies cover a broken file, a bad hand edit or a stale import; a copy made at start from a file
that has just passed the check is always readable, even when the file is broken later while the app runs, and dropping
one the same as the newest keeps 31 different states. 31 copies reach at least a month back, so anything noticed while
making a month's report can still be recovered from before it went wrong; they cost a few kilobytes each.

**Rejected:** SQLite: sturdy and quick to query, but not readable, and its queries go unused at this size. CSV: one flat
table per file, so the shape would need several files tied by IDs. No backup: one bad import could lose the record. 14
copies: a fault noticed at the month's report could be older than the copies. Reading a newer version and ignoring what
it does not know: the next save would drop it. The copy made by the day's first save, from the file on disk: a file
broken while the app ran was copied as it was. The app's last saved text handed along with every save for the copy:
every save would carry it, for what one copy at start does. Checking the file before the day's first copy: an extra read
and check on the first click.

**Revisit if:** the file grows past what saves instantly, or the owner needs to query the history in ways memory cannot.

**Cases:**

- A crash during a save: on restart the file is the one before the save.
- The file edited by hand into invalid JSON: the app names the problem and offers the newest copy.
- Valid JSON with an entry missing its start: the app names the problem and offers the newest copy.
- No record file: no record yet; nothing is reported as wrong.
- A record of version 3 opened, or imported, by an app that knows version 2: refused with the message to update and a
  link to the releases page; the file is unchanged.
- The 32nd copy: the oldest of the 31 is deleted.
- Started three times on Monday, once on Tuesday with nothing changed, once on Wednesday: one copy made Monday, none on
  Tuesday (the same as Monday's), one on Wednesday.
- The file broken while the app runs, then the day's first click: the record is saved whole, and today's copy, made at
  start, is readable.

## The app reaches each machine as an installer from a GitHub release (2026-11-16)

**Built by:** Clocking, for the build, the first release and the link to it; Reports, for the updater.

**Decision:** the owner builds only on Linux. A release is made by pushing a version tag, such as `v0.2.0`; GitHub then
builds the installers with Tauri's action, for Windows and for Linux, and puts them on a draft release on the repo's
releases page, which the owner publishes. The action stops if the tag and the app's version disagree. The owner installs
on each machine from that page; a newer installer updates the program in place and leaves the app's data folder (the
record, its copies and the settings) untouched, and uninstalling keeps it unless the owner ticks to delete it. The
version is major.minor.patch, raised by hand in `tauri.conf.json`, `package.json` and `Cargo.toml` alike, by the release
procedure: one minor version per phase (Phase 1 ships as `0.1.0`), a patch for a fix between phases, and `1.0.0` the day
the owner switches from Excel. A record from a newer version, refused with the message to update ("The record is one
JSON file"), offers the releases page. In the last phase the app gains an updater: it notices a new release and offers
to install it.

**Why:** the dual-boot Windows has no dev setup and should never need one; it only receives a finished app, as the work
machine will every time the app changes. A tag builds only what the owner means to use. Releases for Linux too mean the
home machine runs what the work machine runs. The data folder is separate from the program, so updating can never cost
the record; the refusal of a newer record keeps an old installer from harming it, and its link says where to go. A minor
version per phase names each step on the way, and 1.0 marks the app taking over from Excel.

**Rejected:** building on Windows: a second dev setup to keep up. A build on every push: slow, and installers nobody
meant to use. The updater from the start: signing keys and setup for a problem that does not exist while one person
installs by hand.

**Revisit if:** releases come so often that installing by hand is a chore, before the last phase.

**Cases:**

- Version 0.2.0 installed over 0.1.0 on Windows: the app opens on the record as it was.
- Tag `v0.2.0` pushed while `tauri.conf.json` still says 0.1.0: the build stops and names the mismatch.
- The app uninstalled with the box left unticked, then installed again: the record is there.
