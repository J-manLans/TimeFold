# Design decisions

The template, the principles most decisions follow, and every decision's title by area, each area linking the file that
holds its decisions. Read this index before a design opinion, and the area files the opinion touches. Present tense:
what is true now. Open questions stay out (`../open-questions.md`); so does state (`../roadmap.md`). Cite a decision by
its title, "in `design-decisions/`"; a split then changes only this index.

## Template

```
## Title (date last settled)

**Built by:** only while some of it is not built: the phase that builds it (before the roadmap is agreed, the part),
or "nothing on the roadmap yet" and what it waits on. The line goes when it is built. An entry without it is taken as
built.

**Decision:** what is true.

**Why:** the reason.

**Rejected:** alternatives worth not suggesting again, each with its reason.

**Revisit if:** the condition that would reopen it.

**Cases:** only while some are not yet tests: concrete examples, given this, expect that. Each case leaves when its
test is written.
```

When a decision changes, rewrite the entry to say what is true now; a reversal that still matters becomes a rejected
alternative. **Rejected** pays off most: an agent will suggest the elegant alternative that was turned down for a reason
it cannot see, and one line there stops it. **Built by** exists because a present-tense decision written before its code
reads as a description of the code. **Cases** keeps what was agreed in talk until its part is built ("Tests come first,
from the owner's rules"); a case that checks two decisions goes under the one it mainly checks and names the other by
title.

## Principles

- **One click to start or stop.** Anything that slows the click down needs a strong reason.
- **The record is the owner's and stays on their own machines.**
- **Work time is time present minus errands.** Every total in the app and in reports is counted this way.
- **A signal tells the owner something they can act on.** An effect for its own sake is left out.
- **Figures that mean alike behave alike.** The flex bar's number and the ceiling wheel's turn to the neon by one rule:
  past their line.

## Decisions by area

### Scope (`scope/`)

**[Boundaries](scope/boundaries.md)**

- One user, offline, on the owner's machines
- Handover between machines
- The app is in Swedish
- Old history is pruned on request
- A plain window app
- What the app does

**[First start](scope/first-start.md)**

- A first install starts fresh or imports
- A record that cannot be read offers the newest copy

### [Stack](stack.md)

- Tauri, desktop on Windows and Linux
- Svelte with TypeScript for the interface
- Rust touches the disk; TypeScript knows the record
- The record is one JSON file
- The app reaches each machine as an installer from a GitHub release

### [Code](code.md)

- Tests come first, from the owner's rules
- Code style
- Design tokens hold every value of the look

### [Recording](recording.md)

- One start/stop button and a profile list
- The app opens on the running profile, or the last one on screen
- The last click can be undone for a few seconds
- A running entry from an earlier day asks
- Time away is a gap or an added break
- Entering a length of time

### [Profiles](profiles.md)

- Profiles label the hours
- The other profiles share a ceiling
- A pay estimate per profile
- Settings change from a date

### [Time](time.md)

- Expected hours: 6 a day, Monday to Friday
- Time counts on the day it was worked
- Time is counted to the second and shown to the minute
- A day owes its expected hours only when work started on it
- A flex day can be marked ahead, and the screen counts it at once
- The app's month is the calendar month

### [Corrections](corrections.md)

- Editing an entry on its line
- Entries remember how they were made
- Every edit carries a reason

### Main screen (`main-screen/`)

**[Layout](main-screen/layout.md)**

- The main screen has a controls side and a dashboard
- A narrow window stacks the dashboard over the controls
- The menu has tabs, with every value locked behind "Ändra"

**[Look](main-screen/look.md)**

- The look: a fresh display face, mono text and soft buttons
- A light or dark theme, following the system

**[Figures](main-screen/figures.md)**

- The flex bar
- The ceiling wheel

**[Colours](main-screen/colours.md)**

- Each profile carries its colours

### [Reports](reports.md)

- The report is a PDF
- A report covers one month
- The report lists the days the balance moved
