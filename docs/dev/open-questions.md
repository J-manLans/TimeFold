# Open questions

What is not decided, grouped under the phase that needs the answer, so a phase's **Settle first** can point here.
Each entry: what is known, the options, the date raised, and **See:** the decisions it touches. An answered question
leaves; its answer goes to `design-decisions/`. A question half answered stays with what is left of it.

## Phase 1: Clocking

### Code style (2026-11-14)

How the code is written, settled before the first file. The agent's leans: standard tools with their defaults,
changed as little as possible: Prettier with its Svelte plugin for TypeScript, Svelte and CSS, and rustfmt for Rust,
run automatically; ESLint with the TypeScript and Svelte rules, and clippy for Rust; TypeScript in strict mode;
each language's usual naming, English in code and comments, Swedish only in what the user sees; lines of 120, as in
the docs; Vitest for TypeScript tests and Rust's own tests for the Rust side. Comments follow AGENTS.md (docstrings
say what a thing is and does; work still to do is a TODO).
The owner's preference: files grouped into sections with a banner comment, a line of `=` above and below a centred
section name, in each language's comment style. The agent's leans for it: banners in files with several parts (the
design tokens, a logic module, a longer component), none in a small component with one job; one fixed width, to the line
length, and one level only.
**See:** Tests come first, from the owner's rules; Svelte with TypeScript for the interface.

## Phase 2: Breaks and flex days

### Where a flex day is marked (2026-11-14)

A flex day, for one day or a range, takes the expected hours off the balance with one action ("A day owes its
expected hours only when work started on it"). Where that action lives is open: in the menu, from the "Visa alla"
popup on a chosen day, or beside "Lägg till paus". Not drawn in the main screen sketch.
**See:** A day owes its expected hours only when work started on it; The main screen has a control side and a
figures side.

## Phase 3: Corrections

### Joining two entries (2026-11-14)

Removing a gap between two entries, such as after a stop and start by mistake. Options: dragging one entry's handle
to meet the other on the line, which then join; or a "join" action on two neighbouring entries of the same profile.
**See:** Editing an entry on its line.

### Deleting an entry, and writing a forgotten one (2026-11-14)

How an entry is removed, and how a whole forgotten entry is written by hand. A new entry could be drawn on a line in
free time, with the same stops at other entries and midnight.
**See:** Editing an entry on its line.

### Exact minutes on the line (2026-11-14)

Whether the handles snap (such as to 5 minutes), and whether a time can also be typed or set with the clock for
precision. The draft's clock picker was meant for editing; the line may replace it there, or work beside it.
**See:** Editing an entry on its line.
